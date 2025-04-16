import {BadRequestException, Injectable,  NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Ticket} from "./entities/ticket.entity";
import {Event} from "../event/entities/event.entity";
import {User} from "../user/entities/user.entity";

@Injectable()
export class TicketService {
  constructor(
      @InjectRepository(Ticket)
      private readonly ticketRepo: Repository<Ticket>,
      @InjectRepository(Event)
      private readonly eventRepo: Repository<Event>,
      @InjectRepository(User)
      private readonly userRepo: Repository<User>,
  ) {}

  // Метод для проверки (валидации) билета по QR-коду
  async checkTicket(ticketCode: string) {
    const ticket = await this.ticketRepo
        .createQueryBuilder('ticket')
        .leftJoinAndSelect('ticket.order', 'order')
        .leftJoinAndSelect('order.user', 'user')
        .leftJoinAndSelect('order.event', 'event')
        .where('ticket.ticket_code = :code', { code: ticketCode })
        .select([
          'ticket.id',
          'ticket.ticket_code',
          'ticket.is_used',
          'ticket.secret_code',
          'order.id',
          'user.email',
          'event.title',
          'event.date_time',
        ])
        .getOne();

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (ticket.is_used) {
      throw new BadRequestException('Ticket already used');
    }

    if (ticket.order?.event?.date_time && new Date(ticket.order.event.date_time) < new Date()) {
      throw new BadRequestException('Event is already over');
    }

    return ticket;
  }

  async useTicket(ticketCode: string) {
    const ticket = await this.ticketRepo.findOne({ where: { ticket_code: ticketCode } });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (ticket.is_used) {
      throw new BadRequestException('Ticket has already been used');
    }

    ticket.is_used = true;
    ticket.used_at = new Date(); // если есть такое поле
    await this.ticketRepo.save(ticket);

    return ticket;
  }

}
