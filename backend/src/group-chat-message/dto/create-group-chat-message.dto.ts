import { Type } from "class-transformer";
import { IsInt, IsString } from "class-validator";

export class CreateGroupChatMessageDto {
  @Type(() => Number)
  @IsInt()
  groupId: number;

  @Type(() => Number)
  @IsInt()
  userId: number;

  @IsString()
  message: string;
}
