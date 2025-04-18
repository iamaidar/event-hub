import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsBoolean, IsEnum,
} from "class-validator";
import {EventStatus} from "../event-status.enum";

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsDateString()
  date_time: string; // ISO-строка, например "2025-12-12T10:00:00Z"

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  categoryId?: string;

  @IsNumber()
  price: number;

  @IsNumber()
  total_tickets: number;

  @IsString()
  status: string;

  @IsOptional()
  @IsBoolean()
  is_verified?: boolean;

  @IsOptional()
  @IsString()
  image_base64?: string;
}
