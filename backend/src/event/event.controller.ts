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
  ParseIntPipe,
  Req, Logger,
} from "@nestjs/common";
import { EventService } from "./event.service";
import { JwtGuard } from "../auth/guard";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { FilterEventDto } from "./dto/filter-event.dto";
import { PaginationDto } from "../common/dto/pagination.dto";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Public } from "../auth/decorator";
import { Roles } from "../auth/decorator";

@ApiTags("Event")
@ApiBearerAuth()
@Controller("events")
@UseGuards(JwtGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // Маршрут фильтрации – публичный
  @Public()
  @Get("filter")
  @ApiOperation({ summary: "Фильтрация мероприятий с пагинацией" })
  @ApiResponse({
    status: 200,
    description: "Отфильтрованный список мероприятий с пагинацией.",
  })
  filterEventsPaginated(
    @Query() filterDto: FilterEventDto,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.eventService.filterEventsPaginated(filterDto, paginationDto);
  }

  @Roles("user")
  @Post("add-to-calendar/:id")
  addToCalendar(@Param("id", ParseIntPipe) id: number, @Req() req: any) {
    return this.eventService.addEventToCalendar(id, req.user);
  }

  @Post()
  @ApiOperation({ summary: "Создать мероприятие" })
  @Roles('organizer')
  @ApiResponse({
    status: 200,
    description: "Мероприятие успешно создано.",
  })
  create(@Body() createEventDto: CreateEventDto, @Req() req: any) {
    return this.eventService.create(createEventDto, req.user);
  }

  // Защищённый маршрут получения уникальных локаций
  @Get("locations")
  @ApiOperation({ summary: "Получить все уникальные локации мероприятий" })
  @ApiResponse({
    status: 200,
    description: "Список уникальных локаций.",
  })
  @Public()
  getAllLocations() {
    return this.eventService.getAllLocations();
  }

  // Маршрут получения всех мероприятий – публичный
  @Public()
  @Get()
  @ApiOperation({ summary: "Получить все мероприятия с пагинацией" })
  @ApiResponse({
    status: 200,
    description: "Список мероприятий с пагинацией.",
  })
  findAllPaginated(@Query() paginationDto: PaginationDto) {
    return this.eventService.findAllPaginated(paginationDto);
  }

  @Get('admin')
  @Roles("admin")
  @ApiOperation({ summary: "Получить все мероприятия с пагинацией" })
  @ApiResponse({
    status: 200,
    description: "Список мероприятий с пагинацией.",
  })
  findAllPaginatedAdmin(@Query() paginationDto: PaginationDto) {
    return this.eventService.findAllPaginated(paginationDto,true);
  }

  // Защищённый маршрут получения мероприятия по ID
  @Public()
  @Get(":id")
  @ApiOperation({ summary: "Получить мероприятие по ID" })
  @ApiResponse({
    status: 200,
    description: "Детали мероприятия.",
  })
  findOne(@Param("id") id: string) {
    return this.eventService.findOne(id);
  }

  // Защищённый маршрут обновления мероприятия
  @Patch(":id")
  @ApiOperation({ summary: "Обновить мероприятие по ID" })
  @Roles("admin")
  @ApiResponse({
    status: 200,
    description: "Мероприятие успешно обновлено.",
  })
  update(@Param('id', ParseIntPipe) id: number,@Body() updateEventDto: UpdateEventDto) {

    return this.eventService.update(id, updateEventDto);
  }

  // Защищённый маршрут удаления мероприятия
  @Delete(":id")
  @ApiOperation({ summary: "Удалить мероприятие по ID" })
  @Roles("admin", "organizer")
  @ApiResponse({
    status: 200,
    description: "Мероприятие успешно удалено.",
  })
  remove(@Param("id") id: string) {
    return this.eventService.remove(id);
  }

  @Public()
  @Get(":id/available-tickets")
  @ApiOperation({
    summary: "Получить количество свободных билетов на мероприятие",
  })
  @ApiResponse({
    status: 200,
    description: "Количество доступных билетов.",
  })
  getAvailableTickets(@Param("id") id: number) {
    return this.eventService.getAvailableTicketsCountAndPrice(id);
  }
}
