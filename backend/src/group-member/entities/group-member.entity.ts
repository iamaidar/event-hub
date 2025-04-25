import {
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from "typeorm";
import { AppBaseEntity } from "../../common/app-base.entity";
import { EventGroup } from "../../event-group/entities/event-group.entity";
import { User } from "../../user/entities/user.entity";

@Index(["group", "user"], { unique: true })
@Entity("group_members")
export class GroupMember extends AppBaseEntity {
  @ManyToOne(() => EventGroup, { nullable: false })
  @JoinColumn({ name: "group_id" })
  group: EventGroup;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: User;

  @CreateDateColumn({ name: "joined_at", type: "timestamptz", nullable: true })
  joinedAt: Date;
}
