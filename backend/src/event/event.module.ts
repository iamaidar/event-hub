import { Module } from "@nestjs/common";
import { EventService } from "./event.service";
import { EventController } from "./event.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Event } from "./entities/event.entity";
import { Category } from "../category/entities/category.entity";
import { Order } from "../order/entities/order.entity";
import { EmailModule } from "src/email/email.module";
import { OrganizerEventController } from "./event-organizer.controller";
import { CalendarModule } from "src/calendar/calendar.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Category, Order]),
    EmailModule,
    CalendarModule,
  ],
  controllers: [EventController, OrganizerEventController],
  providers: [EventService],
  exports: [TypeOrmModule],
})
export class EventModule {}
