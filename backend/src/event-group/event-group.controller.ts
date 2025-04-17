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
  ParseIntPipe,
  Query,
  Req,
} from "@nestjs/common";
import { EventGroupService } from "./event-group.service";
import { CreateEventGroupDto } from "./dto/create-event-group.dto";
import { UpdateEventGroupDto } from "./dto/update-event-group.dto";
import { JwtGuard } from "src/auth/guard";
import { Roles } from "src/auth/decorator";
import { PaginationDto } from "src/common/dto/pagination.dto";

@UseGuards(JwtGuard)
@Roles("user")
@Controller("event-group")
export class EventGroupController {
  constructor(private readonly eventGroupService: EventGroupService) {}

  @Get("check-is-ticket-bought")
  checkIsUserBoughtTicket(
    @Req() request: any,
    @Query("eventId", ParseIntPipe) eventId: number,
  ) {
    return this.eventGroupService.checkIsUserBoughtTicket(
      eventId,
      request.user,
    );
  }

  @Post()
  create(@Body() dto: CreateEventGroupDto, @Request() req: any) {
    return this.eventGroupService.create(dto, req.user);
  }

  @Get()
  findAll(
    @Req() request: any,
    @Query() paginationDto: PaginationDto,
    @Query("eventId", ParseIntPipe) eventId?: number,
  ) {
    return this.eventGroupService.findAllPaginated(
      paginationDto,
      request.user,
      eventId,
    );
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.eventGroupService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateEventGroupDto,
  ) {
    return this.eventGroupService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.eventGroupService.remove(id);
  }
}
