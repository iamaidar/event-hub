// event/dto/filter-event.dto.ts
import {IsOptional, IsString, IsDateString, IsEnum, IsBoolean} from 'class-validator';
import {EventStatus} from "../event-status.enum";

export class FilterEventDto {
    // Фильтр по части названия мероприятия (регистронезависимый поиск)
    @IsOptional()
    @IsString()
    title?: string;

    // Фильтр по идентификатору категории
    @IsOptional()
    @IsString()
    categoryId?: string;

    // Фильтр по идентификатору организатора
    @IsOptional()
    @IsString()
    organizerId?: string;

    // Дата начала диапазона (ISO-строка)
    @IsOptional()
    @IsDateString()
    dateFrom?: string;

    // Дата окончания диапазона (ISO-строка)
    @IsOptional()
    @IsDateString()
    dateTo?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsEnum(EventStatus, { each: true })
    status?: EventStatus[];

    @IsOptional()
    @IsBoolean()
    isVerified?: boolean;

    @IsOptional()
    @IsString()
    search?: string;
}
