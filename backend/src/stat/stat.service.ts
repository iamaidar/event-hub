import {Injectable, Logger} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
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
    ) {
        const l = new Logger('StatService');
        l.log('Review entity:', Review);
        l.log('Event entity:', Event);
        l.log('User entity:', User);

    }

    // Расчет общей статистики для админ панели
    async getAdminStats() {
        // Считаем общее количество верифицированных мероприятий
        const totalVerifiedEvents = await this.eventRepository.count({
            where: { is_verified: true },
        });

        // Считаем количество мероприятий по статусу среди верифицированных
        const endedEvents = await this.eventRepository.count({
            where: { is_verified: true, status: 'completed' },
        });
        const upcomingEvents = await this.eventRepository.count({
            where: { is_verified: true, status: 'scheduled' },
        });
        const canceledEvents = await this.eventRepository.count({
            where: { is_verified: true, status: 'cancelled' },
        });

        // Считаем общее количество отзывов и пользователей
        const [totalReviews, totalUsers] = await Promise.all([
            this.reviewRepository.count(),
            this.userRepository.count(),
        ]);

        // Получаем верифицированные мероприятия для фильтрации отзывов
        const verifiedEvents = await this.eventRepository.find({
            where: { is_verified: true },
        });
        const verifiedEventIds = verifiedEvents.map(event => event.id);

        // Получаем отзывы, относящиеся к верифицированным мероприятиям.
        // Используем QueryBuilder, так как review.event — объект, а не простой ID.
        const reviews = await this.reviewRepository
            .createQueryBuilder('review')
            .leftJoin('review.event', 'event')
            .where('event.id IN (:...ids)', { ids: verifiedEventIds })
            .getMany();

        // Разбиваем отзывы на верифицированные и не верифицированные.
        // Предполагается, что is_moderated === true означает, что отзыв верифицирован.
        const verifiedReviews = reviews.filter(review => review.is_moderated);
        const nonVerifiedReviews = reviews.filter(review => !review.is_moderated);

        // Рассчитываем средний рейтинг для верифицированных отзывов
        const averageReviewScore =
            verifiedReviews.length > 0
                ? verifiedReviews.reduce((sum, review) => sum + review.rating, 0) / verifiedReviews.length
                : 0;

        // Статистика по пользователям:
        // Предполагаем, что у сущности User поле role хранится как объект с полем name,
        // например: { name: 'user' } или { name: 'organizer' } или { name: 'admin' }
        const regularUsersCount = await this.userRepository.count({
            where: { role: { name: 'user' } },
        });
        const organizersCount = await this.userRepository.count({
            where: { role: { name: 'organizer' } },
        });
        const adminsCount = await this.userRepository.count({
            where: { role: { name: 'admin' } },
        });

        // Считаем количество активных пользователей и пользователей, использующих социальную функцию.
        // Предполагается, что поля isActive и socialActive присутствуют в сущности User.
        const activeUsersCount = await this.userRepository.count({
            where: { is_active: true },
        });
        const socialActiveUsersCount = await this.userRepository.count({
            where: { is_social: true },
        });

        return {
            totalVerifiedEvents,
            endedEvents,
            upcomingEvents,
            canceledEvents,
            totalReviews,
            totalUsers,
            verifiedReviewsCount: verifiedReviews.length,
            nonVerifiedReviewsCount: nonVerifiedReviews.length,
            averageReviewScore: parseFloat(averageReviewScore.toFixed(2)),
            regularUsersCount,
            organizersCount,
            adminsCount,
            activeUsersCount,
            socialActiveUsersCount,
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
