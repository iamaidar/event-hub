// src/ticket/ticket.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { OrderService } from '../order/order.service';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketController {
  constructor(private readonly orderService: OrderService) {}

  @Get('validate')
  @ApiOperation({ summary: 'Validate a ticket using its QR code' })
  @ApiQuery({
    name: 'ticketCode',
    description: 'Unique ticket code generated during ticket creation',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Ticket validated successfully and marked as used' })
  async validateTicket(@Query('ticketCode') ticketCode: string) {
    const ticket = await this.orderService.validateTicket(ticketCode);
    return {
      message: 'Ticket validated successfully',
      ticket,
    };
  }
}
