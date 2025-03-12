import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { RoleModule } from "./role/role.module";
import { CategoryModule } from "./category/category.module";
import { EventModule } from "./event/event.module";
import { OrderModule } from "./order/order.module";
import { TicketModule } from "./ticket/ticket.module";
import { ReviewModule } from "./review/review.module";
import { EventGroupModule } from "./event-group/event-group.module";
import { GroupMemberModule } from "./group-member/group-member.module";
import { GroupChatMessageModule } from "./group-chat-message/group-chat-message.module";
import { UserSubscriptionModule } from "./user-subscription/user-subscription.module";
import { NotificationModule } from "./notification/notification.module";
import { SeedModule } from "./seed/seed.module";

import { Role } from "./role/entities/role.entity";
import { User } from "./user/entities/user.entity";
import { Category } from "./category/entities/category.entity";
import { Event } from "./event/entities/event.entity";
import { EventGroup } from "./event-group/entities/event-group.entity";
import { GroupChatMessage } from "./group-chat-message/entities/group-chat-message.entity";
import { GroupMember } from "./group-member/entities/group-member.entity";
import { Notification } from "./notification/entities/notification.entity";
import { Order } from "./order/entities/order.entity";
import { Review } from "./review/entities/review.entity";
import { Ticket } from "./ticket/entities/ticket.entity";
import { UserSubscription } from "./user-subscription/entities/user-subscription.entity";


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DATABASE_HOST || "db",
      port: parseInt(process.env.DATABASE_PORT || "5432", 10),
      username: process.env.DATABASE_USER || "eventhub_user",
      password: process.env.DATABASE_PASSWORD || "eventhub_password",
      database: process.env.DATABASE_NAME || "eventhub_db",
      entities: [
        Role,
        User,
        Category,
        Event,
        EventGroup,
        GroupChatMessage,
        GroupMember,
        Notification,
        Order,
        Review,
        Ticket,
        UserSubscription,
      ],
      synchronize: true,
    }),
    RoleModule,
    UserModule,
    CategoryModule,
    EventModule,
    OrderModule,
    TicketModule,
    ReviewModule,
    EventGroupModule,
    GroupMemberModule,
    GroupChatMessageModule,
    UserSubscriptionModule,
    NotificationModule,
    AuthModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
