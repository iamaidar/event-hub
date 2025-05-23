import { Module } from '@nestjs/common';
import { StatService } from './stat.service';
import { StatController } from './stat.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import { Event } from 'src/event/entities/event.entity';
import { User } from 'src/user/entities/user.entity';
import {Review} from "../review/entities/review.entity";
import { Ticket } from "../ticket/entities/ticket.entity";
import { Order } from "../order/entities/order.entity";

@Module({
  controllers: [StatController],
  providers: [StatService],
  imports: [TypeOrmModule.forFeature([ Event, User,Review,Ticket,Order])],
  exports: [StatService],
})

export class StatModule {

}
