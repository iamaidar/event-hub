import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { AppBaseEntity } from '../../common/app-base.entity';
import { Event } from '../../event/entities/event.entity';
import { User } from '../../user/entities/user.entity';
import { GroupMember } from '../../group-member/entities/group-member.entity';
import { GroupChatMessage } from '../../group-chat-message/entities/group-chat-message.entity';

@Entity('event_groups')
export class EventGroup extends AppBaseEntity {
    @ManyToOne(() => Event, { nullable: false })
    @JoinColumn({ name: 'event_id' })
    event: Event;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'creator_id' })
    creator: User;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'varchar', length: 50 })
    status: string; // например: 'active', 'closed'

    @OneToMany(() => GroupMember, member => member.group)
    members: GroupMember[];

    @OneToMany(() => GroupChatMessage, message => message.group)
    messages: GroupChatMessage[];
}
