import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Event} from "./entities/event.entity";
import {Category} from "../category/entities/category.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Event,Category])],
  controllers: [EventController],
  providers: [EventService],
  exports: [TypeOrmModule],
})
export class EventModule {}
