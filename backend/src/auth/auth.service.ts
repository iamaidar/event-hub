import {
  ForbiddenException,
  Injectable,
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
        return this.signTokens(user.id, user.email, user.role.name);
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

    return this.signTokens(user.id, user.email, user.role.name);
  }

  async signTokens(
    userId: number,
    email: string,
    role: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = {
      sub: userId,
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

      const tokens = await this.signTokens(user.id, user.email, user.role.name);
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

  // Новый метод для Google OAuth
  async googleLogin(googleUser: any) {
    // Ищем пользователя по email или googleId
    let user = await this.userRepository.findOne({
      where: [{ email: googleUser.email }, { google_id: googleUser.googleId }],
      relations: ["role"], // Загружаем роль
    });

    // Если пользователя нет, создаем нового с ролью по умолчанию (например, "user")
    if (!user) {
      const defaultRole = await this.roleRepository.findOne({
        where: { name: "user" }, // Предполагаемая роль по умолчанию
      });

      if (!defaultRole) {
        throw new ForbiddenException("Default role not found");
      }

      user = this.userRepository.create({
        email: googleUser.email,
        username: googleUser.email.split("@")[0], // Генерируем username из email
        firstname: googleUser.firstName,
        lastname: googleUser.lastName,
        google_id: googleUser.googleId,
        role: defaultRole,
        is_active: true,
      });

      await this.userRepository.save(user);
    }

    // Генерируем токены с использованием существующего метода
    return this.signTokens(user.id, user.email, user.role.name);
  }
}
