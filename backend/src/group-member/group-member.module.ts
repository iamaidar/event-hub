import { Module } from '@nestjs/common';
import { GroupMemberService } from './group-member.service';
import { GroupMemberController } from './group-member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {GroupMember} from "./entities/group-member.entity";

@Module({
  controllers: [GroupMemberController],
  providers: [GroupMemberService],
  exports: [TypeOrmModule],
  imports: [TypeOrmModule.forFeature([GroupMember])],
})
export class GroupMemberModule {}
