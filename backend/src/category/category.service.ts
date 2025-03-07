import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginationService } from '../common/services/pagination.service';

@Injectable()
export class CategoryService {
  constructor(
      @InjectRepository(Category)
      private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { parentId, ...rest } = createCategoryDto;
    const category = this.categoryRepository.create(rest);

    if (parentId) {
      const parentCategory = await this.categoryRepository.findOne({
        where: { id: Number(parentId) },
      });
      if (!parentCategory) {
        throw new NotFoundException('Parent category not found');
      }
      category.parent = parentCategory;
    }

    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      relations: ['parent', 'children'],
    });
  }

  // Новый метод для получения категорий с пагинацией
  async findAllPaginated(
      paginationDto: PaginationDto,
  ): Promise<{
    data: Category[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    nextPage: number | null;
  }> {
    const query = this.categoryRepository
        .createQueryBuilder('categories')
        .leftJoinAndSelect('categories.parent', 'parent')
        .leftJoinAndSelect('categories.children', 'children');

    return PaginationService.paginate(query, paginationDto);
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id: Number(id) },
      relations: ['parent', 'children'],
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id: Number(id) },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const { parentId, ...rest } = updateCategoryDto;
    Object.assign(category, rest);

    if (parentId) {
      const parentCategory = await this.categoryRepository.findOne({
        where: { id: Number(parentId) },
      });
      if (!parentCategory) {
        throw new NotFoundException('Parent category not found');
      }
      category.parent = parentCategory;
    }

    return this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id: Number(id) },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    await this.categoryRepository.remove(category);
  }
}