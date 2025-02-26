import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsBoolean()
    is_verified?: boolean;

    @IsOptional()
    parentId?: string;
}