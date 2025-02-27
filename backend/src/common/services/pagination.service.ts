// src/common/services/pagination.service.ts
import {ObjectLiteral, SelectQueryBuilder} from 'typeorm';
import { PaginationDto } from '../dto/pagination.dto';

export class PaginationService {
  static async paginate<T extends ObjectLiteral>(
    query: SelectQueryBuilder<T>,
    paginationDto: PaginationDto,
  ): Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    nextPage: number | null;
  }> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);
    const [data, total] = await query.getManyAndCount();
    const totalPages = Math.ceil(total / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    return { data, total, page, limit, totalPages, nextPage };
  }
}
