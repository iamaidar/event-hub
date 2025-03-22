import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Ticket} from "./entities/ticket.entity";
import {Order} from "../order/entities/order.entity";
import {OrderModule} from "../order/order.module";

@Module({
  controllers: [TicketController],
  providers: [TicketService],
  imports: [TypeOrmModule.forFeature([Ticket,Order]),OrderModule],
  exports: [TypeOrmModule],
})
export class TicketModule {}
