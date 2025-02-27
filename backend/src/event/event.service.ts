// event/event.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { Category } from '../category/entities/category.entity';
import { User } from '../user/entities/user.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FilterEventDto } from './dto/filter-event.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginationService } from '../common/services/pagination.service';

@Injectable()
export class EventService {
  constructor(
      @InjectRepository(Event)
      private readonly eventRepository: Repository<Event>,

      @InjectRepository(Category)
      private readonly categoryRepository: Repository<Category>,
  ) {}

  // Получение всех событий с пагинацией
  async findAllPaginated(
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
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.category', 'category')
        .leftJoin('event.organizer', 'organizer')
        .addSelect(['organizer.id', 'organizer.username','organizer.email']);

    return PaginationService.paginate(query, paginationDto);
  }

  async getAllLocations(): Promise<string[]> {
    const rawLocations = await this.eventRepository
        .createQueryBuilder('events')
        .select('DISTINCT events.location', 'location')
        .getRawMany();

    // Преобразуем результат в массив строк
    return rawLocations.map(item => item.location);
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
    const { title, categoryId, organizerId, dateFrom, dateTo ,location } = filterDto;

    const query = this.eventRepository
        .createQueryBuilder('events') // алиас для events
        .leftJoinAndSelect('events.category', 'categories')
        .leftJoin('events.organizer', 'users')
        .addSelect(['users.id', 'users.username','users.email']); // алиас для организаторов — "users"

    query.andWhere('events.is_verified = :isVerified', { isVerified: true });

    if (title) {
      query.andWhere('events.title ILIKE :title', { title: `%${title}%` });
    }
    if (categoryId) {
      // Используем название параметра, совпадающее с условием
      query.andWhere('categories.id = :category_id', { category_id: categoryId });
    }
    if (organizerId) {
      // Здесь используем алиас "users", который определён выше
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
    const { categoryId, date_time, ...rest } = createEventDto;

    const newEvent = this.eventRepository.create({
      ...rest,
      date_time: new Date(date_time),
      organizer,
    });

    if (categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: Number(categoryId) },
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }
      newEvent.category = category;
    }

    return this.eventRepository.save(newEvent);
  }

  findAll(): Promise<Event[]> {
    return this.eventRepository.find({
      relations: ['category', 'organizer'],
    });
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id: Number(id) },
      relations: ['category', 'organizer'],
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id: Number(id) } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const { categoryId, date_time, ...rest } = updateEventDto;
    Object.assign(event, rest);

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

    return this.eventRepository.save(event);
  }

  async remove(id: string): Promise<void> {
    const event = await this.eventRepository.findOne({ where: { id: Number(id) } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    await this.eventRepository.remove(event);
  }
}
