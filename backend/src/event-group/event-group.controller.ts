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
} from "@nestjs/common";
import { EventGroupService } from "./event-group.service";
import { CreateEventGroupDto } from "./dto/create-event-group.dto";
import { UpdateEventGroupDto } from "./dto/update-event-group.dto";
import { JwtGuard } from "src/auth/guard";
import { Roles } from "src/auth/decorator";

@UseGuards(JwtGuard)
@Roles("user")
@Controller("event-group")
export class EventGroupController {
  constructor(private readonly eventGroupService: EventGroupService) {}

  @Post()
  create(
    @Body() createEventGroupDto: CreateEventGroupDto,
    @Request() req: any,
  ) {
    console.log(req);
    return this.eventGroupService.create(createEventGroupDto, req.user);
  }

  @Get()
  findAll() {
    return this.eventGroupService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.eventGroupService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateEventGroupDto: UpdateEventGroupDto,
  ) {
    return this.eventGroupService.update(+id, updateEventGroupDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.eventGroupService.remove(+id);
  }
}
