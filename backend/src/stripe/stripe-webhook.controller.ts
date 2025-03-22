// src/stripe/stripe-webhook.controller.ts
import { Controller, Post, Req, Res, Headers } from '@nestjs/common';
import { Response, Request } from 'express';
import Stripe from 'stripe';
import { OrderService } from '../order/order.service';

@Controller('webhook')
export class StripeWebhookController {
    constructor(private readonly orderService: OrderService) {}

    @Post()
    async handleWebhook(
        @Req() req: Request,
        @Res() res: Response,
        @Headers('stripe-signature') signature: string,
    ) {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
            apiVersion: '2025-02-24.acacia',
        });

        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET ?? '';
        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
        } catch (err: any) {
            console.error('Webhook signature verification failed:', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            // @ts-ignore
            const orderId = session.metadata.orderId;
            const paymentIntentId = session.payment_intent as string;

            // Подтверждаем заказ и генерируем билеты
            await this.orderService.confirmOrder(orderId, paymentIntentId);
        }

        res.status(200).send();
    }
}
