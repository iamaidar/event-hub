// event/event.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EventService } from './event.service';
import {JwtGuard} from "../auth/guard";
import {CreateEventDto} from "./dto/create-event.dto";
import {UpdateEventDto} from "./dto/update-event.dto";

@Controller('events')
@UseGuards(JwtGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto, @Request() req) {
    // req.user – пользователь, декодированный из JWT
    return this.eventService.create(createEventDto, req.user);
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }
}
