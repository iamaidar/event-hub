// src/entities/user.entity.ts
// src/user/entities/user.entity.ts
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AppBaseEntity } from '../../common/app-base.entity';
import { Role } from '../../role/entities/role.entity';

@Entity('users')
export class User extends AppBaseEntity {
    @Column({ type: 'varchar', length: 255 })
    username: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    firstname?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    lastname?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    gender?: string;

    @Column({ type: 'int', nullable: true })
    age?: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    password_hash?: string;

    @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
    google_id?: string;

    @ManyToOne(() => Role, role => role.users, { eager: true })
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @Column({ type: 'boolean', nullable: true })
    is_social?: boolean;
}
