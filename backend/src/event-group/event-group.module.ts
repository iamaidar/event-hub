import { Module } from "@nestjs/common";
import { EventGroupService } from "./event-group.service";
import { EventGroupController } from "./event-group.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventGroup } from "./entities/event-group.entity";
import { User } from "src/user/entities/user.entity";
import { GroupMember } from "src/group-member/entities/group-member.entity";
import { Event } from "src/event/entities/event.entity";
import { Order } from "src/order/entities/order.entity";

@Module({
  controllers: [EventGroupController],
  providers: [EventGroupService],
  exports: [TypeOrmModule],
  imports: [
    TypeOrmModule.forFeature([EventGroup, User, Event, GroupMember, Order]),
  ],
})
export class EventGroupModule {}
