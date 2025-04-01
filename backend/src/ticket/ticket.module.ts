import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Ticket} from "./entities/ticket.entity";
import {Order} from "../order/entities/order.entity";
import {OrderModule} from "../order/order.module";
import {User} from "../user/entities/user.entity";
import {Event} from "../event/entities/event.entity";

@Module({
  controllers: [TicketController],
  exports: [TypeOrmModule],
  imports: [
    TypeOrmModule.forFeature([Ticket, Order, User, Event]),
    OrderModule,
  ],
  providers: [TicketService],
})
export class TicketModule {}
