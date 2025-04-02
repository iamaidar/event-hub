import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OrderService } from '../order/order.service';
import { Roles } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { TicketService } from './ticket.service';

@ApiTags('Tickets')
@Controller('t')
@UseGuards(JwtGuard)
@Roles('organizer')
export class TicketController {
  constructor(
      private readonly orderService: OrderService,
      private readonly ticketService: TicketService,
  ) {}

  @Get(':ticketCode')
  @ApiOperation({ summary: 'Validate a ticket using its QR code' })
  @ApiParam({
    name: 'ticketCode',
    description: 'Unique ticket code generated during ticket creation',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Ticket validated successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @ApiResponse({ status: 400, description: 'Ticket already used' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async checkTicket(@Param('ticketCode') ticketCode: string) {
    const logger = new Logger('TicketController');

    try {
      const ticket = await this.ticketService.checkTicket(ticketCode);
      return {
        message: 'Ticket validated successfully',
        ticket,
      };
    } catch (error) {
      logger.error(`Failed to check ticket: ${error.message}`);

      if (error instanceof NotFoundException) {
        throw new NotFoundException('Ticket not found');
      }

      if (error instanceof BadRequestException) {
        throw new BadRequestException('Ticket already used');
      }

      throw new InternalServerErrorException('Unexpected error occurred while validating ticket');
    }
  }

  @Post('use/:ticketCode')
  @ApiOperation({ summary: 'Make ticket used' })
  @ApiParam({
    name: 'ticketCode',
  })
  @ApiResponse({
    status: 200,
    description: 'Ticket validated successfully and marked as used',
  })
  async useTicket(@Param('ticketCode') ticketCode: string) {
    const ticket = await this.ticketService.useTicket(ticketCode);
    return {
      message: 'Ticket marked as used successfully',
      ticket,
    };
  }
}
