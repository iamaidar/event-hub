// event/event.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { Category } from '../category/entities/category.entity';
import { User } from '../user/entities/user.entity';
import {CreateEventDto} from "./dto/create-event.dto";
import {UpdateEventDto} from "./dto/update-event.dto";

@Injectable()
export class EventService {
  constructor(
      @InjectRepository(Event)
      private readonly eventRepository: Repository<Event>,

      @InjectRepository(Category)
      private readonly categoryRepository: Repository<Category>,
  ) {}

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
    const event = await this.eventRepository.findOne({ where: { id: Number(id) }, });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const { categoryId, date_time, ...rest } = updateEventDto;
    Object.assign(event, rest);

    // date_time, если пришло
    if (date_time) {
      event.date_time = new Date(date_time);
    }

    // Меняем категорию, если нужно
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
