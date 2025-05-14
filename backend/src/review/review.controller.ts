import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
  ForbiddenException,
  ParseIntPipe,
} from "@nestjs/common";
import { ReviewService } from "./review.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { JwtGuard } from "../auth/guard";
import { Roles } from "../auth/decorator";
import { PaginationDto } from "../common/dto/pagination.dto";
import { Request } from "express";

@Controller("reviews")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Roles("user")
  @UseGuards(JwtGuard)
  @Post()
  create(@Body() dto: CreateReviewDto, @Req() req: any) {
    return this.reviewService.create(dto, req.user);
  }

  @Get("all")
  findAllPaginatedOnly(@Query() paginationDto: PaginationDto) {
    return this.reviewService.findAllPaginated(paginationDto);
  }

  @Get()
  findAll(
    @Req() request: any,
    @Query() paginationDto: PaginationDto,
    @Query("eventId", ParseIntPipe) eventId?: number,
  ) {
    return this.reviewService.findAllPaginated(
      paginationDto,
      request.user,
      eventId,
    );
  }

  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.reviewService.findOne(id);
  }

  @Roles("admin", "user")
  @UseGuards(JwtGuard)
  @Patch(":id")
  update(
    @Param("id") id: number,
    @Body() dto: UpdateReviewDto,
    @Req() req: Request,
  ) {
    if (!req.user) {
      throw new ForbiddenException("You can only update your own reviews");
    } else if (!req.user["role"]) {
      throw new ForbiddenException("You can only update your own reviews");
    }
    const userId = req.user["id"];
    const isAdmin = req.user["role"]["name"] === "admin";
    return this.reviewService.update(id, dto, userId, isAdmin);
  }

  @Roles("admin", "user")
  @UseGuards(JwtGuard)
  @Delete(":id")
  remove(@Param("id") id: number, @Req() req: Request) {
    if (!req.user) {
      throw new ForbiddenException("You can only delete your own reviews");
    } else if (!req.user["role"]) {
      throw new ForbiddenException("You can only delete your own reviews");
    }
    const userId = req.user["id"];
    const isAdmin = req.user["role"]["name"] === "admin";
    return this.reviewService.remove(id, userId, isAdmin);
  }
}
