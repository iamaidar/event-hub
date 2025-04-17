import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsEnum,
  IsIn,
  IsInt,
  Min,
} from "class-validator";

export enum EventGroupStatus {
  ACTIVE = "active",
  CLOSED = "closed",
}

export class CreateEventGroupDto {
  @IsNotEmpty()
  eventId: number;

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

  @IsOptional()
  @IsIn(["male", "female", "any"])
  genderRequirement?: "male" | "female" | "any";

  @IsOptional()
  @IsInt()
  @Min(0)
  minAge?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  maxAge?: number;

  @IsInt()
  @Min(1)
  members_limit: number;
}
