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
import {EventStatus} from "../event/event-status.enum";

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

  // Создание заказа
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

      if (event.status !== EventStatus.PUBLISHED || !event.is_verified) {
        throw new BadRequestException("The event is not available for booking");
      }

      const soldTickets = await this.orderRepo
          .createQueryBuilder("o")
          .select("SUM(o.ticket_count)", "sum")
          .where("o.event_id = :eventId", { eventId: event.id })
          .andWhere("o.status IN (:...statuses)", { statuses: ["confirmed"] })
          .getRawOne();

      const totalSold = Number(soldTickets.sum) || 0;

      if (totalSold + ticketCount > event.total_tickets) {
        throw new BadRequestException("Not enough tickets available for this event");
      }

      const totalAmount = event.price * ticketCount;

      const order = this.orderRepo.create({
        user,
        event,
        total_amount: totalAmount,
        status: "pending", // можно заменить на OrderStatus.PENDING, если есть enum
        ticket_count: ticketCount,
      });

      return await this.orderRepo.save(order);
    } catch (error) {
      if (
          error instanceof BadRequestException ||
          error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException("An error occurred while creating the order");
    }
  }

  // Подтверждение заказа (webhook)
  async confirmOrder(orderId: string, stripePaymentId: string) {
    const order = await this.orderRepo.findOne({
      where: { id: Number(orderId) },
      relations: ["user", "event"],
    });
    if (!order) throw new NotFoundException("Order not found");

    if (order.status === "confirmed") return;

    order.status = "confirmed";
    order.stripe_payment_id = stripePaymentId;
    await this.orderRepo.save(order);

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
      secretCode: ticket.secret_code,
    }));

    await this.emailService.sendTicketEmail(
        order.user.email,
        order.event.title,
        ticketsWithQr,
    );
  }

  async generateTicketsForOrder(order: Order) {
    const tickets: Ticket[] = [];
    const QRCode = await import("qrcode");
    const { nanoid } = await import("nanoid");

    const baseVerifyUrl = "http://localhost:5173/t";

    for (let i = 0; i < order.ticket_count; i++) {
      const ticketCode = nanoid(8);
      const ticketUrl = `${baseVerifyUrl}/${ticketCode}`;

      const qrData = await QRCode.toDataURL(ticketUrl, {
        errorCorrectionLevel: "M",
        margin: 1,
        scale: 4,
      });

      const ticket = this.ticketRepo.create({
        order,
        ticket_code: ticketCode,
        qr_code_data: qrData,
        secret_code : this.generateFiveDigitCode()

      });

      tickets.push(ticket);
    }

    await this.ticketRepo.save(tickets);
    return tickets;
  }

  public generateFiveDigitCode(): string {
    return Math.floor(10000 + Math.random() * 90000).toString();
  }

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
      },
      relations: ["event"],
      order: {
        createdAt: "DESC",
      },
    });
  }

  async checkTicket(ticketCode: string) {
    const ticket = await this.ticketRepo.findOne({
      where: {
        ticket_code: ticketCode,
      },
    });
    if (!ticket) throw new NotFoundException("Ticket not found");
    return ticket;
  }
}
