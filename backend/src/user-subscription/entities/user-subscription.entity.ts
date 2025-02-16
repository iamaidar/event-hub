import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { AppBaseEntity } from '../../common/app-base.entity';
import { User } from '../../user/entities/user.entity';
import { Category } from '../../category/entities/category.entity';

@Index(['user', 'category'], { unique: true })
@Entity('user_subscriptions')
export class UserSubscription extends AppBaseEntity {
    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Category, { nullable: false })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ type: 'varchar', length: 50 })
    frequency: string; // например: 'daily', 'weekly', 'monthly'
}
