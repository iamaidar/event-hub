import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AppBaseEntity } from '../../common/app-base.entity';
import { Event } from '../../event/entities/event.entity';
import { User } from '../../user/entities/user.entity';

@Entity('reviews')
export class Review extends AppBaseEntity {
    @ManyToOne(() => Event, { nullable: false })
    @JoinColumn({ name: 'event_id' })
    event: Event;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'int' })
    rating: number; // диапазон, например, 1–5

    @Column({ type: 'text', nullable: true })
    comment?: string;

    @Column({ type: 'boolean', default: false })
    is_moderated: boolean;
}
