import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroupChatMessageService } from './group-chat-message.service';
import { CreateGroupChatMessageDto } from './dto/create-group-chat-message.dto';
import { UpdateGroupChatMessageDto } from './dto/update-group-chat-message.dto';

@Controller('group-chat-message')
export class GroupChatMessageController {
  constructor(private readonly groupChatMessageService: GroupChatMessageService) {}

  @Post()
  create(@Body() createGroupChatMessageDto: CreateGroupChatMessageDto) {
    return this.groupChatMessageService.create(createGroupChatMessageDto);
  }

  @Get()
  findAll() {
    return this.groupChatMessageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupChatMessageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupChatMessageDto: UpdateGroupChatMessageDto) {
    return this.groupChatMessageService.update(+id, updateGroupChatMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupChatMessageService.remove(+id);
  }
}
