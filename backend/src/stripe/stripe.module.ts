// src/stripe/stripe.module.ts
import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Module({
    providers: [StripeService],
    exports: [StripeService], // <--- Обязательно экспортировать!
})
export class StripeModule {}
