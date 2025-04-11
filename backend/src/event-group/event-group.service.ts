import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { CreateEventGroupDto } from "./dto/create-event-group.dto";
import { UpdateEventGroupDto } from "./dto/update-event-group.dto";
import { Repository } from "typeorm";
import { EventGroup } from "./entities/event-group.entity";
import { Event } from "src/event/entities/event.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { GroupMember } from "src/group-member/entities/group-member.entity";
import { PaginationService } from "src/common/services/pagination.service";
import { PaginationDto } from "src/common/dto/pagination.dto";

@Injectable()
export class EventGroupService {
  constructor(
    @InjectRepository(EventGroup)
    private readonly eventGroupRepository: Repository<EventGroup>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(GroupMember)
    private readonly groupMemberRepository: Repository<GroupMember>,
  ) {}

  async findAllPaginated(
    paginationDto: PaginationDto,
    currentUser: User,
    eventId?: number,
  ): Promise<{
    data: EventGroup[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    nextPage: number | null;
  }> {
    const query = this.eventGroupRepository
      .createQueryBuilder("group")
      .leftJoinAndSelect("group.event", "event")
      .leftJoin("group.creator", "creator")
      .addSelect(["creator.id", "creator.username", "creator.email"])
      .leftJoinAndSelect("group.members", "members")
      .leftJoinAndSelect("members.user", "memberUser")
      .where("1=1"); // базовое условие

    if (eventId) {
      query.andWhere("event.id = :eventId", { eventId });
    }

    return PaginationService.paginate(query, paginationDto);
  }

  async create(dto: CreateEventGroupDto, user: User) {
    if (!user.is_social) {
      throw new ForbiddenException(
        "You don't have access to this functionality.",
      );
    }

    try {
      const event = await this.eventRepository.findOne({
        where: { id: dto.eventId },
      });

      if (!event) {
        throw new NotFoundException("Event not found.");
      }

      const newEventGroup = this.eventGroupRepository.create({
        event: event,
        creator: user,
        title: dto.title,
        description: dto.description,
        status: dto.status,
        genderRequirement: dto.genderRequirement,
        minAge: dto.minAge,
        maxAge: dto.maxAge,
      });

      const savedEventGroup =
        await this.eventGroupRepository.save(newEventGroup);

      const creatorAsMember = this.groupMemberRepository.create({
        group: savedEventGroup,
        user: user,
        joinedAt: new Date(),
      });

      await this.groupMemberRepository.save(creatorAsMember);

      return savedEventGroup;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<EventGroup[]> {
    return this.eventGroupRepository.find({
      relations: ["event", "creator"],
      order: { createdAt: "DESC" },
    });
  }

  async findOne(id: number): Promise<EventGroup> {
    const group = await this.eventGroupRepository.findOne({
      where: { id },
      relations: ["event", "creator", "members", "members.user"],
    });
    if (!group) throw new NotFoundException("EventGroup not found");
    return group;
  }

  async update(id: number, dto: UpdateEventGroupDto): Promise<EventGroup> {
    const group = await this.eventGroupRepository.findOneBy({ id });
    if (!group) throw new NotFoundException("EventGroup not found");

    Object.assign(group, dto);
    return this.eventGroupRepository.save(group);
  }

  async remove(id: number) {
    const group = await this.eventGroupRepository.findOneBy({ id });
    if (!group) throw new NotFoundException("EventGroup not found");

    await this.eventGroupRepository.remove(group);
  }
}
