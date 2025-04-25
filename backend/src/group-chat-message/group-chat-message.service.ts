import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateGroupChatMessageDto } from "./dto/create-group-chat-message.dto";
import { UpdateGroupChatMessageDto } from "./dto/update-group-chat-message.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { EventGroup } from "src/event-group/entities/event-group.entity";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { GroupChatMessage } from "./entities/group-chat-message.entity";

@Injectable()
export class GroupChatMessageService {
  constructor(
    @InjectRepository(GroupChatMessage)
    private readonly chatRepo: Repository<GroupChatMessage>,

    @InjectRepository(EventGroup)
    private readonly groupRepo: Repository<EventGroup>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createMessage(
    dto: CreateGroupChatMessageDto,
  ): Promise<GroupChatMessage> {
    const group = await this.groupRepo.findOne({ where: { id: dto.groupId } });
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });

    if (!group) throw new NotFoundException("Group not found");
    if (!user) throw new NotFoundException("User not found");

    const message = this.chatRepo.create({ group, user, message: dto.message });
    return this.chatRepo.save(message);
  }

  async getMessages(groupId: number): Promise<GroupChatMessage[]> {
    return this.chatRepo.find({
      where: { group: { id: groupId } },
      relations: ["user"],
      order: { createdAt: "ASC" },
    });
  }
}
