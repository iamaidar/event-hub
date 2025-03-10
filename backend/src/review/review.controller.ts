import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req, Logger} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtGuard } from '../auth/guard';
import { Roles } from '../auth/decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Request } from 'express';


@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Roles('user')
  @UseGuards(JwtGuard)
  @Post()
  create(@Body() dto: CreateReviewDto, @Req() req: Request) {
    return this.reviewService.create(dto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.reviewService.findAllPaginated(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.reviewService.findOne(id);
  }

  @Roles('admin', 'user')
  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateReviewDto) {
    const userId=1;
    const isAdmin =true;
    return this.reviewService.update(id, dto, userId, isAdmin);
  }

  @Roles('admin', 'user')
  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @Body() dto: any) {
    const userId=1;
    const isAdmin =true;
    return this.reviewService.remove(id, userId, isAdmin);
  }
}