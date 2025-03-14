import {Controller, Get, UseGuards} from '@nestjs/common';
import { StatService } from './stat.service';
import {Roles} from "../auth/decorator";
import {JwtGuard} from "../auth/guard";

@Controller('stat')
export class StatController {
  constructor(private readonly statService: StatService) {}

  @Get('admin')
  @UseGuards(JwtGuard)
  @Roles('admin')
  getAdminStats() {
    return this.statService.getAdminStats();
  }

  @Get('organizer')
  @Roles('organizer')
  @UseGuards(JwtGuard)
  getOrganizerStats(organizerId: string) {
    return this.statService.getOrganizerStats(organizerId);
  }
}
