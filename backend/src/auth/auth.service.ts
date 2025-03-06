import { ForbiddenException, Injectable } from "@nestjs/common";
import { SignInDto, SignupDto } from "./dto";
import * as argon from "argon2";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { Role } from "src/role/entities/role.entity";
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

    const userRole = await this.roleRepository.findOne({
      where: { name: "user" },
    });

    try {
      if (userRole) {
        const user = this.userRepository.create({
          username: dto.username,
          email: dto.email,
          password_hash: hash,
          role: userRole,
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
    console.log(access_token);
    console.log(refresh_token);
    // Возвращаем «сырые» данные – глобальный интерцептор оформит их в:
    // { success: true, data: { access_token, refresh_token }, message: "OK" }
    return { access_token, refresh_token };
  }
  async updateRefreshToken(userId: number, refresh_token: string) {
    const refresh_token_hash = await argon.hash(refresh_token);
    await this.userRepository.update(userId, {
      refresh_token_hash: refresh_token_hash,
    });
  }

  async refreshToken(userId: number, refresh_token: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

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

    const tokens = await this.signTokens(userId, user.email, user.role.name);
    await this.updateRefreshToken(userId, tokens.refresh_token);
  }

  async logout(userId: number) {
    await this.userRepository.update(userId, { refresh_token_hash: undefined });
    return {};
  }
}
