import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { Review } from "src/review/entities/review.entity";
import { Event } from "src/event/entities/event.entity";
import { User } from "src/user/entities/user.entity";
import {EventStatus} from "../event/event-status.enum";
import {OrganizerStatDto} from "./dto/ticket-sale.dto";
import { Ticket } from "../ticket/entities/ticket.entity";
import { Order } from "src/order/entities/order.entity";

@Injectable()
export class StatService {
  constructor(
      @InjectRepository(Review)
      private readonly reviewRepository: Repository<Review>,
      @InjectRepository(Event)
      private readonly eventRepository: Repository<Event>,
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      @InjectRepository(Ticket)
      private readonly ticketRepository: Repository<Ticket>,
      @InjectRepository(Order)
      private readonly orderRepository: Repository<Order>,
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

  async getOrganizerStats(organizerId: string): Promise<OrganizerStatDto> {
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
          monthlyTicketSales: [],
          ordersTotal: 0,
          ordersPending: 0,
          ordersConfirmed: 0,
          ordersCancelled: 0,
          ordersRefunded: 0,
          ordersTotalAmount: 0,
          ticketsTotal: 0,
          ticketsCancelled: 0,
          ticketsSold: 0,
        };
      }

      const reviewsReceived = await this.reviewRepository
          .createQueryBuilder("review")
          .leftJoin("review.event", "event")
          .where("event.id IN (:...ids)", { ids: organizerEventIds })
          .getCount();


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

      const rawSales = await this.ticketRepository
          .createQueryBuilder('ticket')
          // ticket -> order
          .innerJoin('ticket.order', 'ord')
          // order -> event
          .innerJoin('ord.event', 'evt')
          // event -> organizer
          .innerJoin('evt.organizer', 'org')
          .where('org.id = :organizerIdNumber', { organizerIdNumber })
          .select("TO_CHAR(DATE_TRUNC('month', ord.created_at), 'YYYY-MM')", 'month')
          .addSelect('COUNT(*)', 'ticketsSold')
          .groupBy('month')
          .orderBy('month', 'ASC')
          .getRawMany<{ month: string; ticketsSold: string }>();

      const monthlyTicketSales = rawSales.map(r => ({
        month: r.month,
        ticketsSold: Number(r.ticketsSold),
      }));

      const participantsCount = await this.ticketRepository
          .createQueryBuilder('ticket')
          .innerJoin('ticket.order', 'ord')
          .innerJoin('ord.event', 'evt')
          .innerJoin('evt.organizer', 'org')
          .where('org.id = :organizerIdNumber', { organizerIdNumber })
          .getCount();

      const ordersAgg = await this.orderRepository
          .createQueryBuilder('ord')
          .innerJoin('ord.event', 'evt')
          .innerJoin('evt.organizer', 'org')
          .where('org.id = :orgId', { orgId: organizerIdNumber })
          .select('COUNT(*)', 'ordersTotal')
          .addSelect(`SUM(ord.total_amount)`, 'ordersTotalAmount')
          .addSelect(`SUM(CASE WHEN ord.status = 'pending'    THEN 1 ELSE 0 END)`, 'ordersPending')
          .addSelect(`SUM(CASE WHEN ord.status = 'confirmed'  THEN 1 ELSE 0 END)`, 'ordersConfirmed')
          .addSelect(`SUM(CASE WHEN ord.status = 'cancelled'  THEN 1 ELSE 0 END)`, 'ordersCancelled')
          .addSelect(`SUM(CASE WHEN ord.status = 'refunded'   THEN 1 ELSE 0 END)`, 'ordersRefunded')
          .getRawOne<{
            ordersTotal: string;
            ordersTotalAmount: string;
            ordersPending: string;
            ordersConfirmed: string;
            ordersCancelled: string;
            ordersRefunded: string;
          }>();

      const ticketsAgg = await this.ticketRepository
          .createQueryBuilder('t')
          .innerJoin('t.order', 'ord')
          .innerJoin('ord.event', 'evt')
          .innerJoin('evt.organizer', 'org')
          .where('org.id = :orgId', { orgId: organizerIdNumber})
          .select('COUNT(*)', 'ticketsTotal')
          .addSelect(
              `SUM(CASE WHEN ord.status IN ('cancelled','refunded') THEN 1 ELSE 0 END)`,
              'ticketsCancelled',
          )
          .getRawOne<{ ticketsTotal: string; ticketsCancelled: string }>();

      const ticketsTotal = Number(ticketsAgg?.ticketsTotal ?? '0');
      const ticketsCancelled = Number(ticketsAgg?.ticketsCancelled ?? '0');
      
      return {
        organizerId: organizerIdNumber,
        eventsCreated,
        reviewsReceived,
        participantsCount,
        averageReviewScore: parseFloat(averageReviewScore.toFixed(2)),
        eventsWithoutReviewsCount: eventsWithoutReviews.length,
        monthlyTicketSales,
        ordersTotal: Number(ordersAgg?.ordersTotal ?? '0'),
        ordersPending: Number(ordersAgg?.ordersPending ?? '0'),
        ordersConfirmed: Number(ordersAgg?.ordersConfirmed ?? '0'),
        ordersCancelled: Number(ordersAgg?.ordersCancelled ?? '0'),
        ordersRefunded: Number(ordersAgg?.ordersRefunded ?? '0'),
        ordersTotalAmount: Number(ordersAgg?.ordersTotalAmount ?? '0'),

        ticketsTotal,
        ticketsCancelled,
        ticketsSold: ticketsTotal - ticketsCancelled,
      };
    } catch (error) {
      logger.error(`Ошибка при получении статистики для организатора ID: ${organizerId}`, error);
      throw new Error(`Ошибка при получении статистики для организатора ID: ${organizerId}`);
    }
  }
}
