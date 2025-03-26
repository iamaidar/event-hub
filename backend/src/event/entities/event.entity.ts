import {Entity, Column, ManyToOne, JoinColumn, OneToMany} from 'typeorm';
import { AppBaseEntity } from '../../common/app-base.entity';
import { Category } from '../../category/entities/category.entity';
import { User } from '../../user/entities/user.entity';
import {Order} from "../../order/entities/order.entity";

@Entity('events')
export class Event extends AppBaseEntity {

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'timestamptz' })
    date_time: Date;

    @Column({ type: 'varchar', length: 255 })
    location: string;

    @ManyToOne(() => Category, { nullable: true })
    @JoinColumn({ name: 'category_id' })
    category?: Category;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'organizer_id' })
    organizer: User;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'int' })
    total_tickets: number;

    @Column({ type: 'varchar', length: 50 })
    status: string; // например: 'scheduled', 'cancelled', 'completed'

    @Column({ type: 'boolean', nullable: true })
    is_verified?: boolean;

    @Column({ type: "text", nullable: true })
    image_base64?: string;

    @OneToMany(() => Order, (order) => order.event)
    orders: Order[];



}
