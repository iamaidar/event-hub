import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { CalendarService } from "./calendar.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [CalendarService],
  exports: [CalendarService],
})
export class CalendarModule {}
