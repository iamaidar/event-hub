import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupChatMessageDto } from './create-group-chat-message.dto';

export class UpdateGroupChatMessageDto extends PartialType(CreateGroupChatMessageDto) {}
