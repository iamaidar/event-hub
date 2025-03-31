import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm/dist/typeorm.module";
import { Role } from "src/role/entities/role.entity";
import { User } from "src/user/entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { GoogleStrategy } from "./strategy/google.strategy";

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: "jwt" }),
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "15m" },
    }),
    TypeOrmModule.forFeature([User, Role]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
})
export class AuthModule {}
