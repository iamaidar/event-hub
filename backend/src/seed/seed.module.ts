// seed/seed.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { Category } from 'src/category/entities/category.entity';
import { Event } from 'src/event/entities/event.entity';
import { User } from 'src/user/entities/user.entity';
import {Review} from "../review/entities/review.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Category, Event, User,Review])],
    controllers: [SeedController],
    providers: [SeedService],
})
export class SeedModule {}
