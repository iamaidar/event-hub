// dto/create-review.dto.ts
import { IsInt, IsOptional, IsBoolean, IsString } from 'class-validator';

export class CreateReviewDto {
    @IsInt()
    event_id: number;

    @IsInt()
    user_id: number;

    @IsInt()
    rating: number;

    @IsOptional()
    @IsString()
    comment?: string;

    @IsOptional()
    @IsBoolean()
    is_moderated?: boolean;
}
