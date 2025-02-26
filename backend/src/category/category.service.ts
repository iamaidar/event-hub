// category/category.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import {CreateCategoryDto} from "./dto/create-category.dto";
import {UpdateCategoryDto} from "./dto/update-category.dto";

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

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      relations: ['parent', 'children'],
    });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id : Number(id) },
      relations: ['parent', 'children'],
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id: Number(id) } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const { parentId, ...rest } = updateCategoryDto;
    Object.assign(category, rest);

    // Обновляем родителя, если нужно
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
    const category = await this.categoryRepository.findOne({ where: { id: Number(id)} });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    await this.categoryRepository.remove(category);
  }
}
