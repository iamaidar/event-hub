import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto, SignupDto } from "./dto";
import { JwtGuard } from "./guard";
import { Request } from "express";
import { User } from "src/user/entities/user.entity";

interface RequestWithUser extends Request {
  user: User;
}

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post("signin")
  signin(@Body() dto: SignInDto) {
    return this.authService.signin(dto);
  }

  @Post("refresh")
  @UseGuards(JwtGuard)
  refresh(
    @Req() request: RequestWithUser,
    @Body("refresh_token") refresh_token: string,
  ) {
    return this.authService.refreshToken(request.user.id, refresh_token);
  }

  @Post("logout")
  @UseGuards(JwtGuard)
  logout(@Req() request: RequestWithUser) {
    return this.authService.logout(request.user.id);
  }
}
