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
  Query,
} from '@nestjs/common';
import { EventService } from './event.service';
import { JwtGuard } from '../auth/guard';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FilterEventDto } from './dto/filter-event.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorator/public.decorator'

@ApiTags('Event')
@ApiBearerAuth()
@Controller('events')
@UseGuards(JwtGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // Маршрут фильтрации – публичный
  @Public()
  @Get('filter')
  @ApiOperation({ summary: 'Фильтрация мероприятий с пагинацией' })
  @ApiResponse({
    status: 200,
    description: 'Отфильтрованный список мероприятий с пагинацией.',
  })
  filterEventsPaginated(
      @Query() filterDto: FilterEventDto,
      @Query() paginationDto: PaginationDto,
  ) {
    return this.eventService.filterEventsPaginated(filterDto, paginationDto);
  }

  // Защищённый маршрут создания мероприятия
  @Post()
  @ApiOperation({ summary: 'Создать мероприятие' })
  @ApiResponse({
    status: 201,
    description: 'Мероприятие успешно создано.',
  })
  create(@Body() createEventDto: CreateEventDto, @Request() req) {
    return this.eventService.create(createEventDto, req.user);
  }

  // Защищённый маршрут получения уникальных локаций
  @Get('locations')
  @ApiOperation({ summary: 'Получить все уникальные локации мероприятий' })
  @ApiResponse({
    status: 200,
    description: 'Список уникальных локаций.',
  })
  @Public()
  getAllLocations() {
    return this.eventService.getAllLocations();
  }

  // Маршрут получения всех мероприятий – публичный
  @Public()
  @Get()
  @ApiOperation({ summary: 'Получить все мероприятия с пагинацией' })
  @ApiResponse({
    status: 200,
    description: 'Список мероприятий с пагинацией.',
  })
  findAllPaginated(@Query() paginationDto: PaginationDto) {
    return this.eventService.findAllPaginated(paginationDto);
  }

  // Защищённый маршрут получения мероприятия по ID
  @Get(':id')
  @ApiOperation({ summary: 'Получить мероприятие по ID' })
  @ApiResponse({
    status: 200,
    description: 'Детали мероприятия.',
  })
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  // Защищённый маршрут обновления мероприятия
  @Patch(':id')
  @ApiOperation({ summary: 'Обновить мероприятие по ID' })
  @ApiResponse({
    status: 200,
    description: 'Мероприятие успешно обновлено.',
  })
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(id, updateEventDto);
  }

  // Защищённый маршрут удаления мероприятия
  @Delete(':id')
  @ApiOperation({ summary: 'Удалить мероприятие по ID' })
  @ApiResponse({
    status: 200,
    description: 'Мероприятие успешно удалено.',
  })
  remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }
}
