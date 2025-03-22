import { IsUUID, IsNumber, Min } from 'class-validator';
export class CreateOrderDto {
    @IsUUID()
    eventId: string;

    @IsNumber()
    @Min(1)
    ticketCount: number;
}

