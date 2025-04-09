import { ForbiddenException, Injectable } from "@nestjs/common";
import { CreateEventGroupDto } from "./dto/create-event-group.dto";
import { UpdateEventGroupDto } from "./dto/update-event-group.dto";
import { Repository } from "typeorm";
import { EventGroup } from "./entities/event-group.entity";
import { Event } from "src/event/entities/event.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class EventGroupService {
  constructor(
    @InjectRepository(EventGroup)
    private readonly eventGroupRepository: Repository<EventGroup>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(dto: CreateEventGroupDto, user: User) {
    if (!user.is_social) {
      throw new ForbiddenException(
        "You don't have access to this functionality.",
      );
    }

    const event = await this.eventRepository.findOne({
      where: { id: dto.eventId },
    });

    if (event) {
      const newEventGroup = await this.eventGroupRepository.create({
        event: event,
        creator: user,
        title: dto.title,
        description: dto.description,
        status: dto.status,
      });
    }

    return "This action adds a new eventGroup";
  }

  findAll() {
    return `This action returns all eventGroup`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eventGroup`;
  }

  update(id: number, updateEventGroupDto: UpdateEventGroupDto) {
    return `This action updates a #${id} eventGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} eventGroup`;
  }
}
