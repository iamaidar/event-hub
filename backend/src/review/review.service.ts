// review.service.ts
import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { Review } from "./entities/review.entity";
import { PaginationDto } from "../common/dto/pagination.dto";
import { PaginationService } from "../common/services/pagination.service";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateReviewDto, user: User): Promise<Review> {
    const review = this.reviewRepository.create({
      ...dto,
      user,
      is_moderated: false,
    });
    return this.reviewRepository.save(review);
  }

  async findAllPaginated(
    paginationDto: PaginationDto,
    user: User,
    eventId?: number,
  ): Promise<{
    data: Review[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    nextPage: number | null;
  }> {
    const query = this.reviewRepository
      .createQueryBuilder("review")
      .leftJoinAndSelect("review.user", "user")
      .leftJoinAndSelect("review.event", "event");

    if (eventId !== undefined && eventId !== null) {
      query.andWhere("review.event_id = :eventId", { eventId });
    }

    if (user !== undefined && user !== null && user.role.name === "user") {
      query.andWhere("review.is_moderated = :isVerified", { isVerified: true });
    }

    try {
      const result = await PaginationService.paginate(query, paginationDto);
      return result;
    } catch (error) {
      console.error(`Failed to fetch reviews: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ["event", "user"],
    });
    if (!review) throw new NotFoundException("Review not found");
    return review;
  }

  async update(
    id: number,
    dto: UpdateReviewDto,
    userId: number,
    isAdmin: boolean,
  ): Promise<Review> {
    const review = await this.findOne(id);

    if (!isAdmin && review.user.id !== userId) {
      throw new ForbiddenException("You can only update your own reviews");
    }

    await this.reviewRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number, userId: number, isAdmin: boolean): Promise<void> {
    const review = await this.findOne(id);

    if (!isAdmin && review.user.id !== userId) {
      throw new ForbiddenException("You can only delete your own reviews");
    }

    await this.reviewRepository.delete(id);
  }
}
