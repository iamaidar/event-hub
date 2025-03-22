// src/stripe/stripe.service.ts
import { Injectable } from "@nestjs/common";
import Stripe from "stripe";

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
            apiVersion: '2025-02-24.acacia',
        });
    }

    async createCheckoutSession(amount: number, orderId: number): Promise<Stripe.Checkout.Session> {
        return await this.stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          line_items: [
            {
              price_data: {
                currency: "usd",
                unit_amount: Math.round(amount * 100),
                product_data: {
                  name: `Order #${orderId}`,
                },
              },
              quantity: 1,
            },
          ],
          success_url: `${process.env.CLIENT_URL}/user/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.CLIENT_URL}/user/payment-cancel`,
          metadata: {
            orderId: orderId.toString(),
          },
        });
    }
}
