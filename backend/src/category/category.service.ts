import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginationService } from '../common/services/pagination.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class CategoryService {
  constructor(
      @InjectRepository(Category)
      private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const logger = new Logger('CategoryService');
    logger.log('Начало создания новой категории');

    const { parentId, imageBase64, ...rest } = createCategoryDto;

    if (imageBase64) {
      logger.log('Получена фотография в формате base64');
      if (!this.isBase64(imageBase64)) {
        logger.error('Неверный формат base64 для фотографии', createCategoryDto);
        throw new BadRequestException('Неверный формат base64 для фотографии');
      }
    }

    // При создании сохраняем переданную фотографию (если есть) в свойство image_base64
    const category = this.categoryRepository.create({
      ...rest,
      image_base64: imageBase64,
    });
    logger.log('Категория создана на уровне приложения, но ещё не сохранена в базе');

    if (parentId) {
      logger.log(`Получен идентификатор родительской категории: ${parentId}`);
      const parentCategory = await this.categoryRepository.findOne({
        where: { id: Number(parentId) },
      });
      if (!parentCategory) {
        logger.error(`Родительская категория с id ${parentId} не найдена`);
        throw new NotFoundException('Родительская категория не найдена');
      }
      category.parent = parentCategory;
      logger.log(`Родительская категория с id ${parentId} успешно найдена и присвоена`);
    }

    const savedCategory = await this.categoryRepository.save(category);
    logger.log(`Категория успешно сохранена с id ${savedCategory.id}`);

    return savedCategory;
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      relations: ['parent', 'children'],
    });
  }

  // Метод для получения категорий с пагинацией
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
      throw new NotFoundException('Категория не найдена');
    }
    return category;
  }

  async update(
      id: string,
      updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id: Number(id) },
    });
    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    const { parentId, imageBase64, ...rest } = updateCategoryDto;
    Object.assign(category, rest);

    if (imageBase64) {
      if (!this.isBase64(imageBase64)) {
        throw new BadRequestException('Неверный формат base64 для фотографии');
      }
      category.image_base64 = imageBase64;
    }

    if (parentId) {
      const parentCategory = await this.categoryRepository.findOne({
        where: { id: Number(parentId) },
      });
      if (!parentCategory) {
        throw new NotFoundException('Родительская категория не найдена');
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
      throw new NotFoundException('Категория не найдена');
    }
    await this.categoryRepository.remove(category);
  }

  // Вспомогательный метод для проверки корректности строки base64
  private isBase64(str: string): boolean {
    try {
      // Если строка содержит Data URL, извлекаем часть после запятой
      const base64Str = str.includes(',') ? str.split(',')[1] : str;
      // Проверяем, совпадает ли результат повторного кодирования с исходной строкой
      return Buffer.from(base64Str, 'base64').toString('base64') === base64Str.replace(/[\n\r]/g, '');
    } catch (error) {
      return false;
    }
  }
}