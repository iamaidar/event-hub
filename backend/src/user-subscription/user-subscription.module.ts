import { Module } from '@nestjs/common';
import { UserSubscriptionService } from './user-subscription.service';
import { UserSubscriptionController } from './user-subscription.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {UserSubscription} from "./entities/user-subscription.entity";

@Module({
  controllers: [UserSubscriptionController],
  providers: [UserSubscriptionService],
  exports:[TypeOrmModule],
  imports: [TypeOrmModule.forFeature([UserSubscription])],
})
export class UserSubscriptionModule {}
