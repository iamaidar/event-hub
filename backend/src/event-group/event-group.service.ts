import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
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
import { Order } from "src/order/entities/order.entity";
import { group } from "console";

@Injectable()
export class EventGroupService {
  constructor(
    @InjectRepository(EventGroup)
    private readonly eventGroupRepository: Repository<EventGroup>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(GroupMember)
    private readonly groupMemberRepository: Repository<GroupMember>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
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
    try {
      console.log("findAllPaginated - Input parameters:", {
        paginationDto,
        currentUser: currentUser
          ? { id: currentUser.id, username: currentUser.username }
          : null,
        eventId,
      });

      const query = this.eventGroupRepository
        .createQueryBuilder("group")
        .leftJoinAndSelect("group.event", "event")
        .leftJoin("group.creator", "creator")
        .addSelect(["creator.id", "creator.username", "creator.email"])
        .leftJoinAndSelect("group.members", "members")
        .leftJoinAndSelect("members.user", "memberUser")
        .where("1=1");

      if (eventId) {
        query.andWhere("event.id = :eventId", { eventId });
        console.log("Applied eventId filter:", { eventId });
      }

      // Фильтрация по members_limit <= количеству участников через подзапрос
      query.andWhere(
        "group.members_limit > (SELECT COUNT(m.id) FROM group_members m WHERE m.group_id = group.id)",
      );

      // Логируем SQL-запрос
      console.log("Generated SQL Query:", await query.getQueryAndParameters());

      // Выполняем запрос
      console.log("Calling PaginationService.paginate...");
      const result = await PaginationService.paginate(query, paginationDto);

      // Логируем результат
      console.log("findAllPaginated - Result:", {
        dataLength: result.data?.length,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        nextPage: result.nextPage,
      });

      return result;
    } catch (error) {
      console.error("findAllPaginated - Error:", {
        message: error.message,
        stack: error.stack,
        paginationDto,
        eventId,
      });
      throw error;
    }
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
        members_limit: dto.members_limit,
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

  async checkIsUserBoughtTicket(
    eventId: number,
    user: User | undefined | null,
  ): Promise<boolean> {
    if (!user?.id) {
      return false;
    }

    const orders = await this.orderRepository.find({
      where: {
        event: { id: eventId },
        status: "confirmed",
        user: { id: user?.id },
      },
    });

    return orders.length > 0;
  }

  async joinToGroup(id: number, user: User) {
    try {
      // Загружаем группу с необходимыми полями
      const group = await this.eventGroupRepository.findOne({
        where: { id },
        relations: ["event", "creator", "members", "members.user"], // Загружаем связанные данные, если нужно
      });

      if (!group) {
        throw new NotFoundException("Group Not Found");
      }

      console.log("Group data:", {
        id: group.id,
        minAge: group.minAge,
        maxAge: group.maxAge,
        genderRequirement: group.genderRequirement,
        members_limit: group.members_limit,
      });

      console.log("User data:", {
        id: user.id,
        age: user.age,
        gender: user.gender,
      });

      // Проверка возраста, если minAge или maxAge заданы
      if (group.minAge !== undefined && group.minAge !== null) {
        if (!user.age || user.age < group.minAge) {
          throw new BadRequestException(
            `User age (${user.age || "not specified"}) does not meet the minimum age requirement (${group.minAge})`,
          );
        }
      }

      if (group.maxAge !== undefined && group.maxAge !== null) {
        if (!user.age || user.age > group.maxAge) {
          throw new BadRequestException(
            `User age (${user.age || "not specified"}) exceeds the maximum age requirement (${group.maxAge})`,
          );
        }
      }

      // Проверка пола, если genderRequirement задан и не "any"
      if (group.genderRequirement && group.genderRequirement !== "any") {
        if (!user.gender) {
          throw new BadRequestException(
            `User gender not specified, but group requires ${group.genderRequirement}`,
          );
        }
        if (
          user.gender.toLowerCase() !== group.genderRequirement.toLowerCase()
        ) {
          throw new BadRequestException(
            `User gender (${user.gender}) does not match group requirement (${group.genderRequirement})`,
          );
        }
      }

      console.log(group.members);
      if (group.members.some((member) => member.user.id === user.id)) {
        throw new BadRequestException("User is already a member of this group");
      }

      if (group.status === "closed") {
        throw new BadRequestException("Cannot join a closed group");
      }

      if (group.members && group.members.length >= group.members_limit) {
        throw new BadRequestException(
          `Group has reached its member limit (${group.members_limit})`,
        );
      }

      // Пример: создание записи в GroupMember (предполагается, что есть GroupMemberRepository)
      const groupMember = this.groupMemberRepository.create({
        group,
        user,
      });
      await this.groupMemberRepository.save(groupMember);

      return { message: "Successfully joined the group", groupId: id };
    } catch (error) {
      console.error("Error in joinToGroup:", {
        message: error.message,
        stack: error.stack,
        groupId: id,
        userId: user.id,
      });
      throw error; // Перебрасываем ошибку, чтобы она дошла до контроллера
    }
  }

  async isUserInAnyGroupByEventId(eventId: number, userId: number) {
    try {
      const groupMember = await this.groupMemberRepository.findOne({
        where: {
          group: { event: { id: eventId } },
          user: { id: userId },
        },
        relations: ["group", "group.event"],
      });

      console.log({
        result: !!groupMember,
        groupId: groupMember?.group.id,
      });

      return {
        result: !!groupMember,
        groupId: groupMember?.group.id,
      };
    } catch (error) {
      console.error("Error in isUserInAnyGroupByEventId:", {
        message: error.message,
        stack: error.stack,
        eventId,
        userId,
      });
      throw new InternalServerErrorException(
        "Failed to check group membership",
      );
    }
  }

  async getUsersGroups(eventId: number, userId: number) {
    let members = await this.groupMemberRepository.find({
      where: {
        user: { id: userId },
        group: { id: eventId },
      },
      relations: ["user", "group"],
    });

    const groups = members.map((g) => g.group);

    return groups;
  }
}
