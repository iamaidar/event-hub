import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AppBaseEntity } from '../../common/app-base.entity';
import { Order } from '../../order/entities/order.entity';

@Entity('tickets')
export class Ticket extends AppBaseEntity {
    @ManyToOne(() => Order, { nullable: false })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column({ type: 'varchar', length: 100, unique: true })
    ticket_code: string;

    @Column({ type: 'text' })
    qr_code_data: string;

    @Column({ type: 'boolean', default: false })
    is_used: boolean;

    @Column({ type: 'timestamptz', nullable: true })
    used_at?: Date;
}
