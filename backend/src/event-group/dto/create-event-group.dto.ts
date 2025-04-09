import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsEnum,
} from "class-validator";

export enum EventGroupStatus {
  ACTIVE = "active",
  CLOSED = "closed",
}

export class CreateEventGroupDto {
  @IsNotEmpty()
  eventId: number;
  @IsNotEmpty()
  creatorId: string;

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(EventGroupStatus)
  @IsNotEmpty()
  status: EventGroupStatus;
}
