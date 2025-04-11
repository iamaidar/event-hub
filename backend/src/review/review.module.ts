import { Module } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { ReviewController } from "./review.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "./entities/review.entity";
import { User } from "src/user/entities/user.entity";
import { Event } from "src/event/entities/event.entity";

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [TypeOrmModule],
  imports: [TypeOrmModule.forFeature([Review, Event])],
})
export class ReviewModule {}
