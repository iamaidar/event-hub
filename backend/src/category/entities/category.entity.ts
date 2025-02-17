import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { AppBaseEntity } from '../../common/app-base.entity';

@Entity('categories')
export class Category extends AppBaseEntity {
    @Column({ type: 'varchar', length: 100, unique: true })
    name: string;

    @Column({ type: 'boolean', nullable: true })
    is_verified?: boolean;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @ManyToOne(() => Category, category => category.children, { nullable: true })
    @JoinColumn({ name: 'parent_id' })
    parent?: Category;

    @OneToMany(() => Category, category => category.parent)
    children: Category[];
}

