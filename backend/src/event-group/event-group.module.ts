import { Module } from "@nestjs/common";
import { EventGroupService } from "./event-group.service";
import { EventGroupController } from "./event-group.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventGroup } from "./entities/event-group.entity";
import { User } from "src/user/entities/user.entity";

@Module({
  controllers: [EventGroupController],
  providers: [EventGroupService],
  exports: [TypeOrmModule],
  imports: [TypeOrmModule.forFeature([EventGroup, User, Event])],
})
export class EventGroupModule {}
