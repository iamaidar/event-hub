import {BadRequestException, HttpException, Injectable, Logger, NotFoundException} from '@nestjs/common';
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
    const l = new Logger('d');
    const ticket = await this.ticketRepo.findOne({
      where: { ticket_code: ticketCode },
      relations: ['order'],
    });
    l.log(ticket);
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    if (ticket.is_used) {
      throw new BadRequestException('Ticket already used');
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
