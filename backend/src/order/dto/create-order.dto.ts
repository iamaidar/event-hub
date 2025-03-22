// create-order.dto.ts
import { IsNumber, Min } from 'class-validator';

export class CreateOrderDto {
    @IsNumber()
    eventId: number;

    @IsNumber()
    @Min(1)
    ticketCount: number;
}
