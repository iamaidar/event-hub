import { Module } from "@nestjs/common";
import { GroupChatMessageService } from "./group-chat-message.service";
import { GroupChatMessageController } from "./group-chat-message.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GroupChatMessage } from "./entities/group-chat-message.entity";
import { User } from "src/user/entities/user.entity";
import { EventGroup } from "src/event-group/entities/event-group.entity";
import { GroupChatGateway } from "./group-chat.gateway";

@Module({
  controllers: [GroupChatMessageController],
  providers: [GroupChatMessageService, GroupChatGateway],
  exports: [TypeOrmModule],
  imports: [TypeOrmModule.forFeature([GroupChatMessage, User, EventGroup])],
})
export class GroupChatMessageModule {}
