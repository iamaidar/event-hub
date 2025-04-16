// src/auth/google.strategy.ts
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
      scope: [
        "email",
        "profile",
        "https://www.googleapis.com/auth/calendar.events",
      ], // Добавляем scope для календаря
    });
  }

  // async validate(
  //   accessToken: string,
  //   refreshToken: string,
  //   profile: any,
  //   done: VerifyCallback,
  // ): Promise<any> {
  //   const { emails, name, id } = profile;
  //   const userData = {
  //     email: emails[0].value,
  //     firstName: name.givenName,
  //     lastName: name.familyName,
  //     googleId: id,
  //     googleAccessToken: accessToken,
  //     googleRefreshToken: refreshToken,
  //   };

  //   // Сохраняем или обновляем пользователя
  //   let user = await this.userRepository.findOne({ where: { google_id: id } });
  //   if (!user) {
  //     user = this.userRepository.create(userData);
  //   } else {
  //     user.google_access_token = accessToken;
  //     user.google_refresh_token = refreshToken;
  //   }
  //   await this.userRepository.save(user);

  //   done(null, user);
  // }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    console.log("👉 validate() profile:", profile);
    console.log("👉 accessToken:", accessToken);
    console.log("👉 refreshToken:", refreshToken);

    return {
      email: profile.emails?.[0].value,
      googleId: profile.id,
      firstName: profile.name?.givenName,
      lastName: profile.name?.familyName,
      googleAccessToken: accessToken,
      googleRefreshToken: refreshToken,
    };
  }
}
