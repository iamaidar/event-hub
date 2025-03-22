// src/order/order.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  Req,
  NotFoundException,
  BadRequestException,
  ForbiddenException, UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { StripeService } from '../stripe/stripe.service';
import { Request } from 'express';
import {JwtGuard} from "../auth/guard";
import {Roles} from "../auth/decorator";

@ApiTags('Orders')
@UseGuards(JwtGuard)
@Roles("user")
@Controller('orders')
export class OrderController {
  constructor(
      private readonly orderService: OrderService,
      private readonly stripeService: StripeService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto, description: 'Order creation data' })
  @ApiResponse({ status: 201, description: 'Order successfully created' })
  async createOrder(@Req() req: Request, @Body() dto: CreateOrderDto) {
    if (!req.user) {
      throw new ForbiddenException("You can only update your own reviews");
    } else if (!req.user["role"]) {
      throw new ForbiddenException("You can only update your own reviews");
    }
    const userId = req.user["id"];
    const order = await this.orderService.createOrder(userId, dto);
    return order;
  }

  @Post('pay/:orderId')
  @ApiOperation({ summary: 'Initiate payment for an order via Stripe Checkout' })
  @ApiParam({ name: 'orderId', description: 'Order identifier' })
  @ApiResponse({ status: 200, description: 'Returns a URL for Stripe Checkout payment' })
  async pay(@Param('orderId') orderId: string) {
    const order = await this.orderService.getOrderById(orderId);
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== 'pending') throw new BadRequestException('Order already processed');

    const url = await this.stripeService.createCheckoutSession(order.total_amount, String(order.id));
    return { url };
  }
}
