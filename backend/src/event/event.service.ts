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

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
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
      .createQueryBuilder("event")
      .leftJoinAndSelect("event.category", "category")
      .leftJoin("event.organizer", "organizer")
      .addSelect(["organizer.id", "organizer.username", "organizer.email"])
      .where("event.status = :status", { status: "scheduled" });

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
    const { title, categoryId, organizerId, dateFrom, dateTo, location } =
      filterDto;

    const query = this.eventRepository
      .createQueryBuilder("events") // алиас для events
      .leftJoinAndSelect("events.category", "categories")
      .leftJoin("events.organizer", "users")
      .addSelect(["users.id", "users.username", "users.email"]); // алиас для организаторов — "users"

    query.andWhere("events.is_verified = :isVerified", { isVerified: true });

    if (title) {
      query.andWhere("events.title ILIKE :title", { title: `%${title}%` });
    }
    if (categoryId) {
      query.andWhere("categories.id = :category_id", {
        category_id: categoryId,
      });
    }
    if (organizerId) {
      query.andWhere("users.id = :organizer_id", { organizer_id: organizerId });
    }
    if (dateFrom) {
      query.andWhere("events.date_time >= :dateFrom", { dateFrom });
    }
    if (dateTo) {
      query.andWhere("events.date_time <= :dateTo", { dateTo });
    }
    if (location) {
      query.andWhere("events.location ILIKE :location", {
        location: `%${location}%`,
      });
    }

    return PaginationService.paginate(query, paginationDto);
  }

  async create(
    createEventDto: CreateEventDto,
    organizer: User,
  ): Promise<Event> {
    const {
      categoryId,
      date_time,
      image_base64,
      price,
      total_tickets,
      ...rest
    } = createEventDto;
    const logger = new Logger("EventService");

    logger.log("Получены данные для создания события:");
    logger.log(JSON.stringify({ ...rest }));

    if (image_base64) {
      logger.log("Проверка формата base64 для изображения...");
      if (!this.isBase64(image_base64)) {
        logger.error("Неверный формат base64 для фотографии");
        throw new BadRequestException("Неверный формат base64 для фотографии");
      }
      logger.log("Формат base64 корректный.");
    }

    const parsedPrice = Number(price);
    const parsedTickets = Number(total_tickets);
    logger.log(
      `Преобразование цены: исходное значение "${price}" -> ${parsedPrice}`,
    );
    logger.log(
      `Преобразование total_tickets: исходное значение "${total_tickets}" -> ${parsedTickets}`,
    );

    const newEvent = this.eventRepository.create({
      ...rest,
      price: parsedPrice,
      total_tickets: parsedTickets,
      date_time: new Date(date_time),
      organizer,
      image_base64: image_base64,
    });

    logger.log(
      `Создан объект события до сохранения: ${JSON.stringify(newEvent)}`,
    );

    if (categoryId) {
      logger.log(`Получение категории с id ${categoryId}...`);
      const category = await this.categoryRepository.findOne({
        where: { id: Number(categoryId) },
      });
      if (!category) {
        logger.error(`Категория с ID ${categoryId} не найдена`);
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }
      newEvent.category = category;
      logger.log(
        `Категория успешно найдена и установлена: ${JSON.stringify(category)}`,
      );
    }

    const savedEvent = await this.eventRepository.save(newEvent);
    logger.log(`Событие успешно сохранено с id ${savedEvent.id}`);

    return savedEvent;
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
      throw new NotFoundException("Event not found");
    }
    await this.eventRepository.remove(event);
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
}
