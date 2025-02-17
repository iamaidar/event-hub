import { Injectable } from '@nestjs/common';
import { CreateGroupChatMessageDto } from './dto/create-group-chat-message.dto';
import { UpdateGroupChatMessageDto } from './dto/update-group-chat-message.dto';

@Injectable()
export class GroupChatMessageService {
  create(createGroupChatMessageDto: CreateGroupChatMessageDto) {
    return 'This action adds a new groupChatMessage';
  }

  findAll() {
    return `This action returns all groupChatMessage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} groupChatMessage`;
  }

  update(id: number, updateGroupChatMessageDto: UpdateGroupChatMessageDto) {
    return `This action updates a #${id} groupChatMessage`;
  }

  remove(id: number) {
    return `This action removes a #${id} groupChatMessage`;
  }
}
