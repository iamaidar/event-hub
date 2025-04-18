import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { SignInDto, SignupDto } from "./dto";
import * as argon from "argon2";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { Repository } from "typeorm";
import { Role } from "../role/entities/role.entity";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { EmailService } from "src/email/email.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: SignupDto) {
    const hash = await argon.hash(dto.password);
    const role = await this.roleRepository.findOne({
      where: { name: dto.role },
    });

    try {
      if (role) {
        const user = this.userRepository.create({
          username: dto.username,
          email: dto.email,
          password_hash: hash,
          role: role,
          is_active: true,
        });

        await this.userRepository.save(user);
        return this.signTokens(user.id, user.username, user.email, user.role.name);
      }
    } catch (error) {
      if (error.code === "23505") {
        throw new ForbiddenException("Credentials Taken");
      }
      throw error;
    }
    throw new ForbiddenException("Something went wrong during signup");
  }

  async signin(dto: SignInDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) throw new ForbiddenException("Credentials incorrect");

    const pwMatches = await argon.verify(user.password_hash, dto.password);
    if (!pwMatches) {
      throw new ForbiddenException("Credentials incorrect");
    }

    return this.signTokens(user.id, user.username, user.email, user.role.name);
  }

  async signTokens(
    userId: number,
    username: string,
    email: string,
    role: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = {
      sub: userId,
      name: username,
      email,
      role,
    };

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: "15m",
      secret: this.config.get<string>("JWT_SECRET"),
    });

    const refresh_token = await this.jwt.signAsync(payload, {
      expiresIn: "7d",
      secret: this.config.get<string>("JWT_REFRESH_SECRET"),
    });
    const hash = await argon.hash(refresh_token);

    await this.userRepository.update(userId, {
      refresh_token_hash: hash,
    });

    return { access_token, refresh_token };
  }

  async updateRefreshToken(userId: number, refresh_token: string) {
    const refresh_token_hash = await argon.hash(refresh_token);
    await this.userRepository.update(userId, {
      refresh_token_hash: refresh_token_hash,
    });
  }

  async refreshToken(refresh_token: string) {
    try {
      const payload = this.jwt.verify(refresh_token, {
        secret: this.config.get<string>("JWT_REFRESH_SECRET"),
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user || !user.refresh_token_hash) {
        throw new ForbiddenException("Access Denied");
      }

      const refreshMatches = await argon.verify(
        user.refresh_token_hash,
        refresh_token,
      );

      if (!refreshMatches) {
        throw new ForbiddenException("Access Denied");
      }

      const tokens = await this.signTokens(user.id, user.username, user.email, user.role.name);
      await this.updateRefreshToken(user.id, tokens.refresh_token);
      return tokens;
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async logout(userId: number) {
    await this.userRepository.update(userId, { refresh_token_hash: undefined });
    return {};
  }

  async googleLogin(googleUser: any) {
    const logger = new Logger("AuthService");
    logger.log(
      `Processing Google login for email: ${googleUser?.email || "unknown"}, googleId: ${googleUser?.googleId || "unknown"}`,
    );
    logger.debug(`Received googleUser: ${JSON.stringify(googleUser)}`);

    // Проверяем наличие обязательных полей
    if (!googleUser?.email) {
      logger.error("googleUser.email is missing");
      throw new InternalServerErrorException("Google user email is missing");
    }
    if (!googleUser?.googleId) {
      logger.error("googleUser.googleId is missing");
      throw new InternalServerErrorException("Google user ID is missing");
    }
    if (!googleUser?.googleAccessToken) {
      logger.error("googleUser.googleAccessToken is missing");
      throw new InternalServerErrorException("Google access token is missing");
    }
    if (!googleUser?.googleRefreshToken) {
      logger.warn(
        "googleUser.googleRefreshToken is missing. Refresh token will not be saved.",
      );
    }

    try {
      // Ищем пользователя по email или googleId
      let user = await this.userRepository.findOne({
        where: [
          { email: googleUser.email },
          { google_id: googleUser.googleId },
        ],
        relations: ["role"],
      });

      if (user) {
        // Обновляем токены и данные
        logger.debug(`Found existing user with id: ${user.id}`);
        user.google_access_token = googleUser.googleAccessToken;
        user.google_refresh_token =
          googleUser.googleRefreshToken || user.google_refresh_token;
        user.google_id = googleUser.googleId;
        user.firstname = googleUser.firstName || user.firstname;
        user.lastname = googleUser.lastName || user.lastname;
        await this.userRepository.save(user);
        logger.log(`Updated tokens for userId: ${user.id}`);
      } else {
        // Создаём нового пользователя
        logger.log(`Creating new user for email: ${googleUser.email}`);
        const defaultRole = await this.roleRepository.findOne({
          where: { name: "user" },
        });

        if (!defaultRole) {
          logger.error('Default role "user" not found');
          throw new ForbiddenException("Default role not found");
        }

        user = this.userRepository.create({
          email: googleUser.email,
          username: googleUser.email.split("@")[0],
          firstname: googleUser.firstName || "",
          lastname: googleUser.lastName || "",
          google_id: googleUser.googleId,
          google_access_token: googleUser.googleAccessToken,
          google_refresh_token: googleUser.googleRefreshToken,
          role: defaultRole,
          is_active: true,
        });

        await this.userRepository.save(user);
        logger.log(`Created new user with id: ${user.id}`);
      }

      // Проверяем сохранение токенов
      const savedUser = await this.userRepository.findOne({
        where: { id: user.id },
      });
      if (!savedUser?.google_access_token) {
        logger.error(`google_access_token not saved for userId: ${user.id}`);
        throw new InternalServerErrorException(
          "Failed to save Google access token",
        );
      }
      if (!savedUser.google_refresh_token) {
        logger.warn(`google_refresh_token not saved for userId: ${user.id}`);
      } else {
        logger.debug(`google_refresh_token saved for userId: ${user.id}`);
      }

      // Генерируем JWT-токены
      logger.debug(`Generating JWT tokens for userId: ${user.id}`);
      return this.signTokens(user.id,user.username, user.email, user.role.name);
    } catch (error) {
      logger.error(`Error in googleLogin: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        `Google login failed: ${error.message}`,
      );
    }
  }
}
