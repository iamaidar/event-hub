// src/stripe/stripe.module.ts
import {forwardRef, Module} from '@nestjs/common';
import { StripeService } from './stripe.service';
import {StripeWebhookController} from "./stripe-webhook.controller";
import {OrderModule} from "../order/order.module";

@Module({
    imports: [forwardRef(() => OrderModule)], // <-- forwardRef, если круговая зависимость
    providers: [StripeService],
    exports: [StripeService],
    controllers: [StripeWebhookController],
})
export class StripeModule {}
