import {Injectable, Logger} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Not, Repository} from 'typeorm';
import { Review } from 'src/review/entities/review.entity';
import { Event } from 'src/event/entities/event.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class StatService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}

    async getAdminStats() {
        const totalVerifiedEvents = await this.eventRepository.count({
            where: { is_verified: true },
        });

        const endedEvents = await this.eventRepository.count({
            where: { is_verified: true, status: 'completed' },
        });
        const upcomingEvents = await this.eventRepository.count({
            where: { is_verified: true, status: 'scheduled' },
        });
        const canceledEvents = await this.eventRepository.count({
            where: { is_verified: true, status: 'cancelled' },
        });

        const [totalReviews, totalUsers] = await Promise.all([
            this.reviewRepository.count(),
            this.userRepository.count(),
        ]);

        const verifiedEvents = await this.eventRepository.find({
            where: { is_verified: true },
        });
        const verifiedEventIds = verifiedEvents.map(event => event.id);

      // Отзывы по всем мероприятиям (модерированные / не модерированные)
      const allModeratedReviewCount = await this.reviewRepository.count({
        where: { is_moderated: true }
      });
      const allUnmoderatedReviewCount = await this.reviewRepository.count({
        where: { is_moderated: false }
      });

      const allReviews = await this.reviewRepository.find();
      const averageAllReviewScore =
          allReviews.length > 0
              ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length
              : 0;


      const allUsersCount = await this.userRepository.count();
        const regularUsersCount = await this.userRepository.count({
            where: { role: { name: 'user' } },
        });
        const organizersCount = await this.userRepository.count({
            where: { role: { name: 'organizer' } },
        });
        const adminsCount = await this.userRepository.count({
            where: { role: { name: 'admin' } },
        });

        const activeUsersCount = await this.userRepository.count({
            where: {
                is_active: true,
                role: { name: Not('admin') },
            },
        });

        const socialActiveUsersCount = await this.userRepository.count({
            where: {
                is_social: true,
                role: { name: 'user' },
            },
        });

        const allNonAdminUsersCount = await this.userRepository.count({
            where: {
                role: { name: Not('admin') },
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




    // Расчет статистики для организатора
    async getOrganizerStats(organizerId: string) {
        // Получаем мероприятия, созданные данным организатором.
        const organizerEvents = await this.eventRepository.find({ where: { organizer: { id: Number(organizerId) }  } });
        const eventsCreated = organizerEvents.length;
        const organizerEventIds = organizerEvents.map(event => event.id);

        // Получаем количество отзывов для мероприятий организатора с использованием QueryBuilder,
        // так как в сущности Review поле event хранится как объект.
        const reviewsReceived = await this.reviewRepository
            .createQueryBuilder('review')
            .leftJoin('review.event', 'event')
            .where('event.id IN (:...ids)', { ids: organizerEventIds })
            .getCount();

        // Подсчитываем общее количество участников по всем мероприятиям организатора.
        // Предполагается, что у события есть поле participants, в котором хранится число участников.
        const participantsCount = organizerEvents.reduce(
            (sum, event) => sum + (event['participants'] || 0),
            0,
        );

        // Получаем все отзывы для мероприятий организатора.
        const organizerReviews = await this.reviewRepository
            .createQueryBuilder('review')
            .leftJoin('review.event', 'event')
            .where('event.id IN (:...ids)', { ids: organizerEventIds })
            .getMany();

        // Рассчитываем средний рейтинг для отзывов организатора.
        // В данном примере используется поле rating из сущности Review.
        const averageReviewScore =
            organizerReviews.length > 0
                ? organizerReviews.reduce((sum, review) => sum + review.rating, 0) / organizerReviews.length
                : 0;

        return {
            organizerId,
            eventsCreated,
            reviewsReceived,
            participantsCount,
            averageReviewScore: parseFloat(averageReviewScore.toFixed(2)),
        };
    }

}
