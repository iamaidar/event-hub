import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AppBaseEntity } from '../../common/app-base.entity';
import { User } from '../../user/entities/user.entity';
import { Event } from '../../event/entities/event.entity';

@Entity('orders')
export class Order extends AppBaseEntity {
    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    total_amount: number;

    @Column({ type: 'varchar', length: 50 })
    status: string; // 'pending', 'confirmed', 'cancelled', 'refunded'

    @Column({ type: 'varchar', length: 255, nullable: true })
    stripe_payment_id?: string;

    @ManyToOne(() => Event, { nullable: false })
    @JoinColumn({ name: 'event_id' })
    event: Event;
}
