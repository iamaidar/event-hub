import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { StatService } from "./stat.service";
import { Roles } from "../auth/decorator";
import { JwtGuard } from "../auth/guard";

@Controller("stat")
@UseGuards(JwtGuard)
export class StatController {
  constructor(private readonly statService: StatService) {}

  @Get("admin")
  @Roles("admin")
  getAdminStats() {
    return this.statService.getAdminStats();
  }

  @Get("organizer/:id")
  @Roles("organizer")
  getOrganizerStats(@Param("id") id: string) {
    return this.statService.getOrganizerStats(id);
  }
}
