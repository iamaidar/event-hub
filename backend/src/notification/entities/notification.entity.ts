import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AppBaseEntity } from '../../common/app-base.entity';
import { User } from '../../user/entities/user.entity';

@Entity('notifications')
export class Notification extends AppBaseEntity {
    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'varchar', length: 50 })
    type: string; // например: 'email', 'telegram'

    @Column({ type: 'text' })
    message: string;

    @Column({ type: 'boolean', default: false })
    is_sent: boolean;

    @Column({ type: 'timestamptz', nullable: true })
    sent_at?: Date;
}
