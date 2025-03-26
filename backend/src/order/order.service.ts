// src/order/order.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "./entities/order.entity";
import { Event } from "../event/entities/event.entity";
import { User } from "../user/entities/user.entity";
import { CreateOrderDto } from "./dto/create-order.dto";
import { Ticket } from "../ticket/entities/ticket.entity";

@Injectable()
export class OrderService {
  constructor(
      @InjectRepository(Order)
      private readonly orderRepo: Repository<Order>,
      @InjectRepository(Ticket)
      private readonly ticketRepo: Repository<Ticket>,
      @InjectRepository(Event)
      private readonly eventRepo: Repository<Event>,
      @InjectRepository(User)
      private readonly userRepo: Repository<User>,
  ) {}

  // Этап 1: Создание заказа с статусом "pending"

  async createOrder(userId: string, dto: CreateOrderDto): Promise<Order> {
    try {
      const { eventId, ticketCount } = dto;

      const user = await this.userRepo.findOneBy({ id: Number(userId) });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const event = await this.eventRepo.findOneBy({ id: Number(eventId) });
      if (!event) {
        throw new NotFoundException('Event not found');
      }

      if (event.status !== 'scheduled') {
        throw new BadRequestException('The event is not open for booking');
      }

      const soldTickets = await this.orderRepo
          .createQueryBuilder('o')
          .select('SUM(o.ticket_count)', 'sum')
          .where('o.event_id = :eventId', { eventId: event.id })
          .andWhere('o.status IN (:...statuses)', { statuses: ['confirmed'] })
          .getRawOne();

      const totalSold = Number(soldTickets.sum) || 0;

      if (totalSold + ticketCount > event.total_tickets) {
        throw new BadRequestException('Not enough tickets available for this event');
      }

      const totalAmount = event.price * ticketCount;

      const order = this.orderRepo.create({
        user,
        event,
        total_amount: totalAmount,
        status: 'pending',
        ticket_count: ticketCount,
      });

      return await this.orderRepo.save(order);

    } catch (error) {
      // optionally, throw standardized response if needed
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('An error occurred while creating the order');
    }
  }


  // Этап 3: Подтверждение оплаты. Вызывается из Stripe webhook.
  // Здесь мы обновляем статус заказа и генерируем билеты с QR-кодами.
  async confirmOrder(orderId: string, stripePaymentId: string) {
    const order = await this.orderRepo.findOneBy({ id: Number(orderId) });
    if (!order) throw new NotFoundException('Order not found');

    if (order.status === 'confirmed') return; // Уже подтверждён

    order.status = 'confirmed';
    order.stripe_payment_id = stripePaymentId;
    await this.orderRepo.save(order);

    // Генерация билетов
    await this.generateTicketsForOrder(order);
  }

  // Генерация билетов с QR-кодом для заказа
  async generateTicketsForOrder(order: Order) {
    const tickets:Ticket[] = [];
    // Импортируем библиотеки: uuid для генерации кода, qrcode для генерации изображения
    const { v4: uuid } = await import('uuid');
    const QRCode = await import('qrcode');

    for (let i = 0; i < order.ticket_count; i++) {
      const ticketCode = uuid();
      // Генерируем QR-код (base64 строка)
      const qrData = await QRCode.toDataURL(ticketCode);

      const ticket = this.ticketRepo.create({
        order,
        ticket_code: ticketCode,
        qr_code_data: qrData,
      });
      tickets.push(ticket);
    }

    await this.ticketRepo.save(tickets);
    return tickets;
  }

  // Метод для проверки (валидации) билета по QR-коду
  async validateTicket(ticketCode: string) {
    const ticket = await this.ticketRepo.findOne({
      where: { ticket_code: ticketCode },
      relations: ['order'],
    });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    if (ticket.is_used) {
      throw new Error('Ticket already used');
    }
    // Отмечаем билет как использованный
    ticket.is_used = true;
    ticket.used_at = new Date();
    await this.ticketRepo.save(ticket);
    return ticket;
  }

  // Метод для получения заказа (например, для оплаты)
  async getOrderById(orderId: number): Promise<Order> {
    const order = await this.orderRepo.findOneBy({ id: Number(orderId) });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async getTicketsBySession(sessionId: string) {
    const order = await this.orderRepo.findOne({
      where: { stripe_payment_id: sessionId },
      relations: ['tickets'],
    });

    if (!order) throw new NotFoundException('Order not found by session');

    return {
      orderId: order.id,
      tickets: order.tickets.map((ticket) => ({
        id: ticket.id,
        ticket_code: ticket.ticket_code,
        qr_code_data: ticket.qr_code_data,
      })),
    };
  }

  async getMyOrders(userId: number): Promise<Order[]> {
    return await this.orderRepo.find({
      where: {
        user: { id: userId },
        status: 'pending', // или: In(['pending']) — если статус может быть множественным
      },
      relations: ['event'], // загружаем связанную информацию о мероприятии
      order: {
        createdAt: 'DESC', // сортировка по дате создания, по желанию
      },
    });
  }

}
