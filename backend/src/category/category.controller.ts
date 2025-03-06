// category/category.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards, Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {JwtGuard} from "../auth/guard";
import {CreateCategoryDto} from "./dto/create-category.dto";
import {UpdateCategoryDto} from "./dto/update-category.dto";
import {PaginationDto} from "../common/dto/pagination.dto";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Category} from "./entities/category.entity";
import {Public} from "../auth/decorator";

@ApiTags('Category')
@ApiBearerAuth() // Если требуется авторизация
@Controller('categories')
@UseGuards(JwtGuard) // Защитим эндпоинты JWT-авторизацией
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Создать категорию' })
  @ApiResponse({ status: 201, description: 'Категория успешно создана.', type: Category })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    // Возвращаем напрямую объект, интерцептор упакует его в { success: true, data, ... }
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Получить все категории c пагинацией' })
  @ApiResponse({ status: 200, description: 'Список категорий.' })
  findAllPaginated(@Query() paginationDto: PaginationDto) {
    return this.categoryService.findAllPaginated(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить категорию по ID' })
  @ApiResponse({ status: 200, description: 'Детали категории.' })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить категорию по ID' })
  @ApiResponse({ status: 200, description: 'Категория успешно обновлена.' })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить категорию по ID' })
  @ApiResponse({ status: 200, description: 'Категория успешно удалена.' })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
