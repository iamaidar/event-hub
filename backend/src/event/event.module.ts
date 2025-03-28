import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Event} from "./entities/event.entity";
import {Category} from "../category/entities/category.entity";
import {Order} from "../order/entities/order.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Event,Category,Order])],
  controllers: [EventController],
  providers: [EventService],
  exports: [TypeOrmModule],
})
export class EventModule {}
