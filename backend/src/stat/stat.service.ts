import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { Review } from "src/review/entities/review.entity";
import { Event } from "src/event/entities/event.entity";
import { User } from "src/user/entities/user.entity";
import {EventStatus} from "../event/event-status.enum";

@Injectable()
export class StatService {
  constructor(
      @InjectRepository(Review)
      private readonly reviewRepository: Repository<Review>,
      @InjectRepository(Event)
      private readonly eventRepository: Repository<Event>,
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
  ) {}

  async getAdminStats() {
    const totalVerifiedEvents = await this.eventRepository.count({
      where: { is_verified: true },
    });

    const endedEvents = await this.eventRepository.count({
      where: {
        is_verified: true,
        status: EventStatus.COMPLETED,
      },
    });

    const upcomingEvents = await this.eventRepository.count({
      where: {
        is_verified: true,
        status: EventStatus.PUBLISHED,
      },
    });

    const canceledEvents = await this.eventRepository.count({
      where: {
        is_verified: true,
        status: EventStatus.CANCELLED,
      },
    });

    const [totalReviews, totalUsers] = await Promise.all([
      this.reviewRepository.count(),
      this.userRepository.count(),
    ]);

    const [allModeratedReviewCount, allUnmoderatedReviewCount] = await Promise.all([
      this.reviewRepository.count({ where: { is_moderated: true } }),
      this.reviewRepository.count({ where: { is_moderated: false } }),
    ]);

    const allReviews = await this.reviewRepository.find();
    const averageAllReviewScore =
        allReviews.length > 0
            ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length
            : 0;

    const regularUsersCount = await this.userRepository.count({
      where: { role: { name: "user" } },
    });
    const organizersCount = await this.userRepository.count({
      where: { role: { name: "organizer" } },
    });
    const adminsCount = await this.userRepository.count({
      where: { role: { name: "admin" } },
    });

    const activeUsersCount = await this.userRepository.count({
      where: {
        is_active: true,
        role: { name: Not("admin") },
      },
    });

    const socialActiveUsersCount = await this.userRepository.count({
      where: {
        is_social: true,
        role: { name: "user" },
      },
    });

    const allNonAdminUsersCount = await this.userRepository.count({
      where: {
        role: { name: Not("admin") },
      },
    });

    const totalEvents = await this.eventRepository.count();
    const unverifiedEvents = totalEvents - totalVerifiedEvents;

    return {
      totalVerifiedEvents,
      endedEvents,
      upcomingEvents,
      canceledEvents,
      totalReviews,
      totalUsers,
      verifiedReviewsCount: allModeratedReviewCount,
      nonVerifiedReviewsCount: allUnmoderatedReviewCount,
      averageReviewScore: parseFloat(averageAllReviewScore.toFixed(2)),
      regularUsersCount,
      organizersCount,
      adminsCount,
      activeUsersCount,
      socialActiveUsersCount,
      allUsersCount: totalUsers,
      allNonAdminUsersCount,
      totalEvents,
      unverifiedEvents,
    };
  }

  async getOrganizerStats(organizerId: string) {
    const logger = new Logger("OrganizerStatLogger");

    try {
      logger.log(`Начинаем получение статистики для организатора ID: ${organizerId}`);
      const organizerIdNumber = Number(organizerId);
      if (isNaN(organizerIdNumber)) {
        throw new Error(`Невалидный ID организатора: ${organizerId}`);
      }

      const organizerEvents = await this.eventRepository.find({
        where: { organizer: { id: organizerIdNumber } },
      });
      const eventsCreated = organizerEvents.length;
      const organizerEventIds = organizerEvents.map((event) => event.id);

      if (eventsCreated === 0) {
        return {
          organizerId: organizerIdNumber,
          eventsCreated,
          reviewsReceived: 0,
          participantsCount: 0,
          averageReviewScore: 0,
          eventsWithoutReviewsCount: 0,
        };
      }

      const reviewsReceived = await this.reviewRepository
          .createQueryBuilder("review")
          .leftJoin("review.event", "event")
          .where("event.id IN (:...ids)", { ids: organizerEventIds })
          .getCount();

      const participantsCount = organizerEvents.reduce(
          (sum, event) => sum + (event["participants"] || 0),
          0,
      );

      const organizerReviews = await this.reviewRepository
          .createQueryBuilder("review")
          .leftJoin("review.event", "event")
          .where("event.id IN (:...ids)", { ids: organizerEventIds })
          .getMany();

      const averageReviewScore =
          organizerReviews.length > 0
              ? organizerReviews.reduce((sum, review) => sum + review.rating, 0) / organizerReviews.length
              : 0;

      const eventsWithoutReviews = await this.eventRepository
          .createQueryBuilder("event")
          .leftJoin("event.organizer", "organizer")
          .where("organizer.id = :organizerId", { organizerId: organizerIdNumber })
          .andWhere("event.id NOT IN (SELECT review.event_id FROM reviews review)")
          .getMany();

      return {
        organizerId: organizerIdNumber,
        eventsCreated,
        reviewsReceived,
        participantsCount,
        averageReviewScore: parseFloat(averageReviewScore.toFixed(2)),
        eventsWithoutReviewsCount: eventsWithoutReviews.length,
      };
    } catch (error) {
      logger.error(`Ошибка при получении статистики для организатора ID: ${organizerId}`, error);
      throw new Error(`Ошибка при получении статистики для организатора ID: ${organizerId}`);
    }
  }
}
