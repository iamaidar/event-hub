import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { google } from "googleapis";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";

interface CreateEventDto {
  summary: string;
  description?: string;
  location?: string;
  startDateTime: string;
  endDateTime: string;
  timeZone?: string;
}

@Injectable()
export class CalendarService {
  private oauth2Client;
  private readonly logger = new Logger(CalendarService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );
    this.logger.log("OAuth2 client initialized");
  }

  async createEvent(userId: number, eventDto: CreateEventDto) {
    this.logger.log(
      `Starting createEvent for userId: ${userId}, event: ${JSON.stringify(eventDto)}`,
    );

    // Находим пользователя в базе данных
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.error(`User not found for userId: ${userId}`);
      throw new UnauthorizedException("The user was not found");
    }
    if (!user.google_access_token) {
      this.logger.error(`No Google access token for userId: ${userId}`);
      throw new UnauthorizedException("The user is not logged in via Google");
    }
    this.logger.debug(
      `Found user with google_access_token for userId: ${userId}`,
    );

    // Устанавливаем access_token для OAuth2 клиента
    this.oauth2Client.setCredentials({
      access_token: user.google_access_token,
      refresh_token: user.google_refresh_token, // Добавляем refresh_token
    });
    this.logger.debug("OAuth2 credentials set");

    const calendar = google.calendar({
      version: "v3",
      auth: this.oauth2Client,
    });

    // Формируем объект события
    const event = {
      summary: eventDto.summary,
      description: eventDto.description || "",
      location: eventDto.location || "",
      start: {
        dateTime: eventDto.startDateTime,
        timeZone: eventDto.timeZone || "Asia/Bishkek",
      },
      end: {
        dateTime: eventDto.endDateTime,
        timeZone: eventDto.timeZone || "Asia/Bishkek",
      },
    };
    this.logger.debug(`Event object created: ${JSON.stringify(event)}`);

    try {
      // Создаем событие в Google Calendar
      this.logger.log("Attempting to insert event into Google Calendar");
      const response = await calendar.events.insert({
        calendarId: "primary",
        requestBody: event,
      });

      this.logger.log(
        `Event created successfully for userId: ${userId}, eventId: ${response.data.id}`,
      );
      return {
        id: response.data.id,
        summary: response.data.summary,
        start: response.data.start,
        end: response.data.end,
        link: response.data.htmlLink,
      };
    } catch (error: any) {
      this.logger.error(
        `Failed to create event for userId: ${userId}. Error: ${error.message}`,
        error.stack,
      );
      if (error.code === 401 || error.code === 403) {
        this.logger.warn(`Invalid or expired token for userId: ${userId}`);
        if (!user.google_refresh_token) {
          this.logger.error(`No refresh token available for userId: ${userId}`);
          throw new UnauthorizedException(
            "Re-authorization via Google is required",
          );
        }

        try {
          this.logger.log(`Attempting to refresh token for userId: ${userId}`);
          const { credentials } = await this.oauth2Client.refreshAccessToken();
          user.google_access_token = credentials.access_token;
          user.google_refresh_token =
            credentials.refresh_token || user.google_refresh_token;
          await this.userRepository.save(user);
          this.logger.log(`Token refreshed successfully for userId: ${userId}`);

          // Повторяем запрос с новым токеном
          this.oauth2Client.setCredentials({
            access_token: user.google_access_token,
          });
          const retryResponse = await calendar.events.insert({
            calendarId: "primary",
            requestBody: event,
          });

          this.logger.log(
            `Event created after token refresh for userId: ${userId}, eventId: ${retryResponse.data.id}`,
          );
          return {
            id: retryResponse.data.id,
            summary: retryResponse.data.summary,
            start: retryResponse.data.start,
            end: retryResponse.data.end,
            link: retryResponse.data.htmlLink,
          };
        } catch (refreshError: any) {
          this.logger.error(
            `Failed to refresh token for userId: ${userId}. Error: ${refreshError.message}`,
            refreshError.stack,
          );
          throw new UnauthorizedException(
            "The access token could not be updated. Reauthorization is required",
          );
        }
      }
      throw new BadRequestException(
        `Error when creating an event: ${error.message}`,
      );
    }
  }
}
