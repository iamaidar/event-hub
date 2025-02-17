import { Module } from '@nestjs/common';
import { GroupChatMessageService } from './group-chat-message.service';
import { GroupChatMessageController } from './group-chat-message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {GroupChatMessage} from "./entities/group-chat-message.entity";

@Module({
  controllers: [GroupChatMessageController],
  providers: [GroupChatMessageService],
  exports: [TypeOrmModule],
  imports: [TypeOrmModule.forFeature([GroupChatMessage])],
})
export class GroupChatMessageModule {}
