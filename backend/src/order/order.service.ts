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
import { EmailService } from "src/email/email.service";

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
    private readonly emailService: EmailService,
  ) {}

  // Этап 1: Создание заказа с статусом "pending"

  async createOrder(userId: string, dto: CreateOrderDto): Promise<Order> {
    try {
      const { eventId, ticketCount } = dto;

      const user = await this.userRepo.findOneBy({ id: Number(userId) });
      if (!user) {
        throw new NotFoundException("User not found");
      }

      const event = await this.eventRepo.findOneBy({ id: Number(eventId) });
      if (!event) {
        throw new NotFoundException("Event not found");
      }

      if (event.status !== "scheduled") {
        throw new BadRequestException("The event is not open for booking");
      }

      const soldTickets = await this.orderRepo
        .createQueryBuilder("o")
        .select("SUM(o.ticket_count)", "sum")
        .where("o.event_id = :eventId", { eventId: event.id })
        .andWhere("o.status IN (:...statuses)", { statuses: ["confirmed"] })
        .getRawOne();

      const totalSold = Number(soldTickets.sum) || 0;

      if (totalSold + ticketCount > event.total_tickets) {
        throw new BadRequestException(
          "Not enough tickets available for this event",
        );
      }

      const totalAmount = event.price * ticketCount;

      const order = this.orderRepo.create({
        user,
        event,
        total_amount: totalAmount,
        status: "pending",
        ticket_count: ticketCount,
      });

      return await this.orderRepo.save(order);
    } catch (error) {
      // optionally, throw standardized response if needed
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException(
        "An error occurred while creating the order",
      );
    }
  }

  // Этап 3: Подтверждение оплаты. Вызывается из Stripe webhook.
  // Здесь мы обновляем статус заказа и генерируем билеты с QR-кодами.
  async confirmOrder(orderId: string, stripePaymentId: string) {
    const order = await this.orderRepo.findOne({
      where: { id: Number(orderId) },
      relations: ["user", "event"],
    });
    if (!order) throw new NotFoundException("Order not found");

    if (order.status === "confirmed") return; // Уже подтверждён

    order.status = "confirmed";
    order.stripe_payment_id = stripePaymentId;
    await this.orderRepo.save(order);

    // Генерация билетов
    await this.generateTicketsForOrder(order);

    const tickets = await this.ticketRepo.find({
      where: { order: { id: Number(orderId) } },
    });

    if (!tickets || tickets.length === 0) {
      throw new Error("No tickets generated for the order");
    }

    const ticketsWithQr = tickets.map((ticket, index) => ({
      ticketId: ticket.ticket_code,
      qrCodeBase64: ticket.qr_code_data,
      cid: `qr_${index}_${ticket.ticket_code}`,
      qrBuffer: Buffer.from(ticket.qr_code_data.split(",")[1], "base64"),
    }));

    await this.emailService.sendTicketEmail(
      order.user.email,
      order.event.title,
      ticketsWithQr,
    );
  }

  // Генерация билетов с компактным QR-кодом для заказа
  async generateTicketsForOrder(order: Order) {
    const tickets: Ticket[] = [];
    const QRCode = await import("qrcode");
    const { nanoid } = await import("nanoid"); // Установи nanoid: npm i nanoid

    const baseVerifyUrl = "http://localhost:5173/t"; // 🔁 Короткий путь к проверке билета

    for (let i = 0; i < order.ticket_count; i++) {
      const ticketCode = nanoid(8); // Генерируем короткий уникальный код (8 символов)

      // 🔗 Генерируем компактный URL
      const ticketUrl = `${baseVerifyUrl}/${ticketCode}`;

      // 🖼 Генерируем QR-код с минимальными размерами
      const qrData = await QRCode.toDataURL(ticketUrl, {
        errorCorrectionLevel: "M", // Средняя коррекция ошибок (меньше размер)
        margin: 1, // Минимальный отступ
        scale: 4, // Небольшой масштаб, но всё ещё читаемый
      });

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
      relations: ["order"],
    });
    if (!ticket) {
      throw new NotFoundException("Ticket not found");
    }
    if (ticket.is_used) {
      throw new Error("Ticket already used");
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
    if (!order) throw new NotFoundException("Order not found");
    return order;
  }

  async getTicketsBySession(sessionId: string) {
    const order = await this.orderRepo.findOne({
      where: { stripe_payment_id: sessionId },
      relations: ["tickets", "event"],
    });

    if (!order) throw new NotFoundException("Order not found by session");
    return {
      orderId: order.id,
      tickets: order.tickets.map((ticket) => ({
        id: ticket.id,
        ticket_code: ticket.ticket_code,
        qr_code_data: ticket.qr_code_data,
      })),
      event: order.event,
    };
  }

  async getMyOrders(userId: number): Promise<Order[]> {
    return await this.orderRepo.find({
      where: {
        user: { id: userId },
        // status: 'pending', // или: In(['pending']) — если статус может быть множественным
      },
      relations: ["event"], // загружаем связанную информацию о мероприятии
      order: {
        createdAt: "DESC", // сортировка по дате создания, по желанию
      },
    });
  }
}
