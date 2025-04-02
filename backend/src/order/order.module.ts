import { forwardRef, Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { Ticket } from "../ticket/entities/ticket.entity";
import { User } from "../user/entities/user.entity";
import { Event } from "../event/entities/event.entity";
import { StripeModule } from "../stripe/stripe.module";
import { EmailModule } from "src/email/email.module";
@Module({
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
  imports: [
    TypeOrmModule.forFeature([Order, Ticket, Event, User]),
    forwardRef(() => StripeModule),
    EmailModule,
  ],
})
export class OrderModule {}
