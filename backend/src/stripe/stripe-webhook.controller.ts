// src/stripe/stripe-webhook.controller.ts
import { Controller, Post, Req, Res, Headers } from "@nestjs/common";
import { Response, Request } from "express";
import Stripe from "stripe";
import { OrderService } from "../order/order.service";

@Controller("webhook")
export class StripeWebhookController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers("stripe-signature") signature: string,
  ) {
    console.log("Received Stripe webhook request");
    console.log("Headers:", req.headers);

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
      apiVersion: "2025-02-24.acacia",
    });

    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret,
      );
      console.log("Webhook verified successfully");
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log("Received event type:", event.type);
    console.log("Event data:", JSON.stringify(event, null, 2));

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Checkout session completed:", session);

      if (!session.metadata || !session.metadata.orderId) {
        console.error("Missing orderId in session metadata");
        return res.status(400).send("Missing orderId in session metadata");
      }

      const orderId = session.metadata.orderId;
      console.log("Order ID from metadata:", orderId);
      console.log("Session ID:", session.id);

      try {
        await this.orderService.confirmOrder(orderId, session.id);
        console.log(`Order ${orderId} confirmed successfully`);
      } catch (error) {
        console.error("Error confirming order:", error);
        return res.status(500).send("Error processing order");
      }
    } else {
      console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).send();
  }
}
