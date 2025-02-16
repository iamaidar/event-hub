import { Entity, Column, OneToMany } from 'typeorm';
import { AppBaseEntity } from 'src/common/app-base.entity' ;
import { User } from 'src/user/entities/user.entity';

@Entity('roles')
export class Role extends AppBaseEntity{
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @OneToMany(() => User, user => user.role)
    users: User[];
}
