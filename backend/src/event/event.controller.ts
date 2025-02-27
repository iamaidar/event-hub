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
import {FilterEventDto} from "./dto/filter-event.dto";
import {PaginationDto} from "../common/dto/pagination.dto";
import { Query } from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('Event')
@ApiBearerAuth()
@Controller('events')
@UseGuards(JwtGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('filter')
  @ApiOperation({ summary: 'Фильтрация мероприятий с пагинацией' })
  @ApiResponse({ status: 200, description: 'Отфильтрованный список мероприятий с пагинацией.' })
  filterEventsPaginated(
      @Query() filterDto: FilterEventDto,
      @Query() paginationDto: PaginationDto,
  ) {
    return this.eventService.filterEventsPaginated(filterDto, paginationDto);
  }

  @Post()
  @ApiOperation({ summary: 'Создать мероприятие' })
  @ApiResponse({ status: 201, description: 'Мероприятие успешно создано.', type: Event })
  create(@Body() createEventDto: CreateEventDto, @Request() req) {
    // req.user – пользователь, декодированный из JWT
    return this.eventService.create(createEventDto, req.user);
  }

  @Get('locations')
  @ApiOperation({ summary: 'Получить все уникальные локации мероприятий' })
  @ApiResponse({ status: 200, description: 'Список уникальных локаций.' })
  async getAllLocations() {
    return this.eventService.getAllLocations();
  }

  @Get()
  @ApiOperation({ summary: 'Получить все мероприятия с пагинацией' })
  @ApiResponse({ status: 200, description: 'Список мероприятий с пагинацией.' })
  findAllPaginated(@Query() paginationDto: PaginationDto) {
    return this.eventService.findAllPaginated(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить мероприятие по ID' })
  @ApiResponse({ status: 200, description: 'Детали мероприятия.' })
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить мероприятие по ID' })
  @ApiResponse({ status: 200, description: 'Мероприятие успешно обновлено.' })
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить мероприятие по ID' })
  @ApiResponse({ status: 200, description: 'Мероприятие успешно удалено.' })
  remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }
}
