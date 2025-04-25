import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { GroupChatMessageService } from "./group-chat-message.service";
import { CreateGroupChatMessageDto } from "./dto/create-group-chat-message.dto";

@Controller("group-chat-message")
export class GroupChatMessageController {
  constructor(private readonly groupChatService: GroupChatMessageService) {}

  @Post()
  async sendMessage(@Body() dto: CreateGroupChatMessageDto) {
    return this.groupChatService.createMessage(dto);
  }

  @Get(":groupId")
  async getMessages(@Param("groupId", ParseIntPipe) groupId: number) {
    return this.groupChatService.getMessages(groupId);
  }
}
