import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { Review } from "src/review/entities/review.entity";
import { Event } from "src/event/entities/event.entity";
import { User } from "src/user/entities/user.entity";

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
      where: { is_verified: true, status: "completed" },
    });
    const upcomingEvents = await this.eventRepository.count({
      where: { is_verified: true, status: "scheduled" },
    });
    const canceledEvents = await this.eventRepository.count({
      where: { is_verified: true, status: "cancelled" },
    });

    const [totalReviews, totalUsers] = await Promise.all([
      this.reviewRepository.count(),
      this.userRepository.count(),
    ]);

    // Отзывы по всем мероприятиям (модерированные / не модерированные)
    const allModeratedReviewCount = await this.reviewRepository.count({
      where: { is_moderated: true },
    });
    const allUnmoderatedReviewCount = await this.reviewRepository.count({
      where: { is_moderated: false },
    });

    const allReviews = await this.reviewRepository.find();
    const averageAllReviewScore =
      allReviews.length > 0
        ? allReviews.reduce((sum, review) => sum + review.rating, 0) /
          allReviews.length
        : 0;

    const allUsersCount = await this.userRepository.count();
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

    const totalEvents = await this.eventRepository.count(); // все мероприятия

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
      allUsersCount,
      allNonAdminUsersCount,
      totalEvents,
      unverifiedEvents,
    };
  }

  async getOrganizerStats(organizerId: string) {
    const logger = new Logger("OrganizerStatLogger");

    try {
      // Логируем начало выполнения метода
      logger.log(
        `Начинаем получение статистики для организатора с ID: ${organizerId}`,
      );

      // Преобразуем ID организатора в число и проверяем, является ли это числом
      const organizerIdNumber = Number(organizerId);
      if (isNaN(organizerIdNumber)) {
        throw new Error(`Невалидный ID организатора: ${organizerId}`);
      }

      // Получаем мероприятия, созданные данным организатором
      const organizerEvents = await this.eventRepository.find({
        where: { organizer: { id: organizerIdNumber } },
      });
      const eventsCreated = organizerEvents.length;
      const organizerEventIds = organizerEvents.map((event) => event.id);

      // Логируем количество найденных мероприятий
      logger.log(
        `Найдено ${eventsCreated} мероприятий для организатора с ID: ${organizerIdNumber}`,
      );

      // Если мероприятий нет, сразу возвращаем нулевые значения
      if (eventsCreated === 0) {
        return {
          organizerId: organizerIdNumber,
          eventsCreated,
          reviewsReceived: 0,
          participantsCount: 0,
          averageReviewScore: 0,
        };
      }

      // Получаем количество отзывов для мероприятий организатора
      const reviewsReceived = await this.reviewRepository
        .createQueryBuilder("review")
        .leftJoin("review.event", "event")
        .where("event.id IN (:...ids)", { ids: organizerEventIds })
        .getCount();

      // Логируем количество отзывов
      logger.log(
        `Получено ${reviewsReceived} отзывов для организатора с ID: ${organizerIdNumber}`,
      );

      // Подсчитываем общее количество участников по всем мероприятиям
      const participantsCount = organizerEvents.reduce(
        (sum, event) => sum + (event["participants"] || 0),
        0,
      );

      // Логируем количество участников
      logger.log(`Общее количество участников: ${participantsCount}`);

      // Получаем все отзывы для мероприятий организатора
      const organizerReviews = await this.reviewRepository
        .createQueryBuilder("review")
        .leftJoin("review.event", "event")
        .where("event.id IN (:...ids)", { ids: organizerEventIds })
        .getMany();

      // Логируем количество отзывов
      logger.log(
        `Получено ${organizerReviews.length} отзывов для организатора с ID: ${organizerIdNumber}`,
      );

      // Рассчитываем средний рейтинг для отзывов организатора
      const averageReviewScore =
        organizerReviews.length > 0
          ? organizerReviews.reduce((sum, review) => sum + review.rating, 0) /
            organizerReviews.length
          : 0;

      // Логируем средний рейтинг
      logger.log(
        `Средний рейтинг организатора: ${averageReviewScore.toFixed(2)}`,
      );

      const eventsWithoutReviews = await this.eventRepository
        .createQueryBuilder("event")
        .leftJoin("event.organizer", "organizer")
        .where("organizer.id = :organizerId", {
          organizerId: organizerIdNumber,
        })
        .andWhere(
          "event.id NOT IN (SELECT review.event_id FROM reviews review)",
        )
        .getMany();

      // Количество мероприятий без отзывов
      const eventsWithoutReviewsCount = eventsWithoutReviews.length;

      return {
        organizerId: organizerIdNumber,
        eventsCreated,
        reviewsReceived,
        participantsCount,
        averageReviewScore: parseFloat(averageReviewScore.toFixed(2)),
        eventsWithoutReviewsCount,
      };
    } catch (error) {
      // Логируем ошибку, если она произошла
      logger.error(
        `Ошибка при получении статистики для организатора с ID: ${organizerId}`,
        error,
      );
      throw new Error(
        `Ошибка при получении статистики для организатора с ID: ${organizerId}`,
      );
    }
  }
}
