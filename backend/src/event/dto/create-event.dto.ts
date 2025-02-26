import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsDateString,
    IsOptional,
    IsBoolean,
} from 'class-validator';

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
    categoryId?: string; // ID категории

    @IsNumber()
    price: number;

    @IsNumber()
    total_tickets: number;

    @IsString()
    status: string; // 'scheduled' | 'cancelled' | ...

    @IsOptional()
    @IsBoolean()
    is_verified?: boolean;
}