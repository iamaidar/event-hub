import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Role } from 'src/role/entities/role.entity';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]),
    JwtModule.register({
        secret: process.env.JWT_SECRET || 'super-secret',
        signOptions: { expiresIn: '1h' },
      })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
