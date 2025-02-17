import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AppBaseEntity } from '../../common/app-base.entity';
import { EventGroup } from '../../event-group/entities/event-group.entity';
import { User } from '../../user/entities/user.entity';

@Entity('group_chat_messages')
export class GroupChatMessage extends AppBaseEntity {
    @ManyToOne(() => EventGroup, { nullable: false })
    @JoinColumn({ name: 'group_id' })
    group: EventGroup;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'text' })
    message: string;
}

