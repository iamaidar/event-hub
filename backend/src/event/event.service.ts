// event/event.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Event } from "./entities/event.entity";
import { Category } from "../category/entities/category.entity";
import { User } from "../user/entities/user.entity";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { FilterEventDto } from "./dto/filter-event.dto";
import { PaginationDto } from "../common/dto/pagination.dto";
import { PaginationService } from "../common/services/pagination.service";
import { Order } from "../order/entities/order.entity";
import { EmailService } from "src/email/email.service";
import {EventStatus} from "./event-status.enum";

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly emailService: EmailService,
  ) {}

  // Получение всех событий с пагинацией
  async findAllPaginated(paginationDto: PaginationDto): Promise<{
    data: Event[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    nextPage: number | null;
  }> {
    const query = this.eventRepository
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.category', 'category')
        .leftJoin('event.organizer', 'organizer')
        .addSelect(['organizer.id', 'organizer.username', 'organizer.email'])
        .where('event.status != :deleted', { deleted: EventStatus.DELETED });

    return PaginationService.paginate(query, paginationDto);
  }

  async getAllLocations(): Promise<string[]> {
    const rawLocations = await this.eventRepository
      .createQueryBuilder("events")
      .select("DISTINCT events.location", "location")
      .getRawMany();

    // Преобразуем результат в массив строк
    return rawLocations.map((item) => item.location);
  }

  // Фильтрация событий с пагинацией
  async filterEventsPaginated(
      filterDto: FilterEventDto,
      paginationDto: PaginationDto,
  ): Promise<{
    data: Event[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    nextPage: number | null;
  }> {
    const { title, categoryId, organizerId, dateFrom, dateTo, location, status, isVerified } = filterDto;

    const query = this.eventRepository
        .createQueryBuilder('events')
        .leftJoinAndSelect('events.category', 'categories')
        .leftJoin('events.organizer', 'users')
        .addSelect(['users.id', 'users.username', 'users.email']);

    if (status) {
      query.andWhere('events.status IN (:...status)', { status });
    }

    if (isVerified !== undefined) {
      query.andWhere('events.is_verified = :isVerified', { isVerified });
    }

    if (title) {
      query.andWhere('events.title ILIKE :title', { title: `%${title}%` });
    }
    if (categoryId) {
      query.andWhere('categories.id = :category_id', { category_id: categoryId });
    }
    if (organizerId) {
      query.andWhere('users.id = :organizer_id', { organizer_id: organizerId });
    }
    if (dateFrom) {
      query.andWhere('events.date_time >= :dateFrom', { dateFrom });
    }
    if (dateTo) {
      query.andWhere('events.date_time <= :dateTo', { dateTo });
    }
    if (location) {
      query.andWhere('events.location ILIKE :location', { location: `%${location}%` });
    }

    return PaginationService.paginate(query, paginationDto);
  }


  async create(createEventDto: CreateEventDto, organizer: User): Promise<Event> {
    const { categoryId, date_time, image_base64, price, total_tickets, ...rest } = createEventDto;

    if (image_base64 && !this.isBase64(image_base64)) {
      throw new BadRequestException('Неверный формат base64 для фотографии');
    }

    const newEvent = this.eventRepository.create({
      ...rest,
      price: Number(price),
      total_tickets: Number(total_tickets),
      date_time: new Date(date_time),
      organizer,
      image_base64,
      status: EventStatus.DRAFT,
      is_verified: false,
    });

    if (categoryId) {
      const category = await this.categoryRepository.findOne({ where: { id: Number(categoryId) } });
      if (!category) {
        throw new NotFoundException(`Категория с ID ${categoryId} не найдена`);
      }
      newEvent.category = category;
    }

    return this.eventRepository.save(newEvent);
  }

  findAll(): Promise<Event[]> {
    return this.eventRepository.find({
      relations: ["category", "organizer"],
    });
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id: Number(id) },
      relations: ["category", "organizer"],
    });
    if (!event) {
      throw new NotFoundException("Event not found");
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id: Number(id) },
    });
    if (!event) {
      throw new NotFoundException("Event not found");
    }

    const { categoryId, date_time, image_base64, ...rest } = updateEventDto;
    Object.assign(event, rest);

    if (date_time) {
      event.date_time = new Date(date_time);
    }

    if (image_base64) {
      if (!this.isBase64(image_base64)) {
        throw new BadRequestException("Неверный формат base64 для фотографии");
      }
      event.image_base64 = image_base64;
    }

    if (categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: Number(categoryId) },
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }
      event.category = category;
    }

    return this.eventRepository.save(event);
  }

  async remove(id: string): Promise<void> {
    const event = await this.eventRepository.findOne({
      where: { id: Number(id) },
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    await this.eventRepository.softDelete(id);
  }

  // Вспомогательный метод для проверки корректности строки base64
  private isBase64(str: string): boolean {
    try {
      // Если строка содержит Data URL, извлекаем часть после запятой
      const base64Str = str.includes(",") ? str.split(",")[1] : str;
      return (
        Buffer.from(base64Str, "base64").toString("base64") ===
        base64Str.replace(/[\n\r]/g, "")
      );
    } catch (error) {
      return false;
    }
  }

  async getAvailableTicketsCountAndPrice(eventId: number): Promise<{
    availableTickets: number;
    ticketPrice: number;
  }> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException("Event doesn't found");
    }

    const confirmedOrders = await this.orderRepository.find({
      where: {
        event: { id: eventId },
        status: "confirmed",
      },
    });

    const bookedTickets = confirmedOrders.reduce(
      (total, order) => total + order.ticket_count,
      0,
    );

    const availableTickets = event.total_tickets - bookedTickets;

    return {
      availableTickets: availableTickets >= 0 ? availableTickets : 0,
      ticketPrice: event.price,
    };
  }

  async createByOrganizer(dto: CreateEventDto, user: any): Promise<Event> {
    const {
      categoryId,
      image_base64,
      price,
      total_tickets,
      date_time,
      ...rest
    } = dto;

    if (image_base64 && !this.isBase64(image_base64)) {
      throw new BadRequestException('Invalid base64 format for image');
    }

    const event = this.eventRepository.create({
      ...rest,
      price: Number(price),
      total_tickets: Number(total_tickets),
      date_time: new Date(date_time),
      is_verified: false,
      status: EventStatus.DRAFT,
      organizer: { id: user.id },
      image_base64,
    });

    if (categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: Number(categoryId) },
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }
      event.category = category;
    }

    return this.eventRepository.save(event);
  }


  async updateByOrganizer(id: number, dto: UpdateEventDto, user: any): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id, organizer: { id: user.id } },
    });

    if (!event) {
      throw new NotFoundException('Event not found or not owned by organizer');
    }

    const { categoryId, image_base64, date_time, ...rest } = dto;

    if (image_base64 && !this.isBase64(image_base64)) {
      throw new BadRequestException('Invalid base64 format for image');
    }

    Object.assign(event, rest);

    if (image_base64) {
      event.image_base64 = image_base64;
    }

    if (date_time) {
      event.date_time = new Date(date_time);
    }

    if (categoryId) {
      const category = await this.categoryRepository.findOne({ where: { id: Number(categoryId) } });
      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }
      event.category = category;
    }

    // обновляем статус и верификацию
    event.status = EventStatus.DRAFT;
    event.is_verified = false;

    return this.eventRepository.save(event);
  }

  async softRemoveByOrganizer(id: number): Promise<{ message: string }> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['reviews', 'orders'],
    });

    if (!event) {
      throw new NotFoundException('Событие не найдено');
    }

    const hasReviews = event.reviews?.length > 0;
    const hasOrders = event.orders?.length > 0;

    if (!hasReviews && !hasOrders) {
      await this.eventRepository.softDelete(id);
      return { message: 'Событие было полностью удалено (без связанных данных).' };
    }

    await this.eventRepository.update(id, { status: EventStatus.INACTIVE });

    return {
      message: 'Событие не может быть удалено из-за связанных данных (отзывы или заказы). Оно было помечено как неактивное.',
    };
  }

  async getEventsByOrganizer(
    userId: number,
    paginationDto: PaginationDto,
  ): Promise<{
    data: Event[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    nextPage: number | null;
  }> {
    const query = this.eventRepository
      .createQueryBuilder("event")
      .leftJoinAndSelect("event.category", "category")
      .leftJoin("event.organizer", "organizer")
      .addSelect(["organizer.id", "organizer.username", "organizer.email"])
      .where("organizer.id = :userId", { userId: userId });

    return PaginationService.paginate(query, paginationDto);
  }
}
