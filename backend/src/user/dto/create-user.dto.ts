import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsNotEmpty,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsOptional()
  firstname?: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsInt()
  @IsOptional()
  age?: number;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  roleName: string;

  @IsBoolean()
  is_active: boolean;

  @IsBoolean()
  @IsOptional()
  is_social?: boolean;

  @IsString()
  @IsOptional()
  avatar_base64?: string;

  @IsString()
  @IsOptional()
  avatar_mime_type?: string;
}
