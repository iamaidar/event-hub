import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { SignInDto, SignupDto } from './dto';
import * as argon from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/role/entities/role.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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
      where: { name: 'user' },
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

        // Возвращаем только данные для токена
        return this.signToken(user.id, user.email);
      }
    } catch (error) {
      if (error.code === '23505') {
        throw new ForbiddenException('Credentials Taken');
      }

      throw error;
    }

    throw new ForbiddenException('Something went wrong during signup');
  }

  async signin(dto: SignInDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) throw new ForbiddenException('Credentials incorrect');

    const pwMatches = await argon.verify(user.password_hash, dto.password);

    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }

    return this.signToken(user.id, user.email);
  }

  async signToken(userId: number, email: string): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get<string>('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: secret,
    });

    // Возвращаем «сырые» данные – глобальный интерцептор оформит их в:
    // { success: true, data: { access_token: token }, message: "OK" }
    return { access_token: token };
  }
}
