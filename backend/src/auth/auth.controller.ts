import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto, SignupDto } from "./dto";
import { JwtGuard } from "./guard";
import { Request } from "express";
import { User } from "src/user/entities/user.entity";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";

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
  refresh(@Body("refresh_token") refresh_token: string) {
    return this.authService.refreshToken(refresh_token);
  }

  @Post("logout")
  @UseGuards(JwtGuard)
  logout(@Req() request: RequestWithUser) {
    return this.authService.logout(request.user.id);
  }

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth(@Req() req) {
    // Перенаправление на Google
  }

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    console.log(req);
    const tokens = await this.authService.googleLogin(req.user);

    const redirectUrl = `http://localhost:5173/auth/callback?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`;
    res.redirect(redirectUrl);
  }
}
