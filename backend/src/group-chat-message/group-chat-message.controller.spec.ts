import { Test, TestingModule } from '@nestjs/testing';
import { GroupChatMessageController } from './group-chat-message.controller';
import { GroupChatMessageService } from './group-chat-message.service';

describe('GroupChatMessageController', () => {
  let controller: GroupChatMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupChatMessageController],
      providers: [GroupChatMessageService],
    }).compile();

    controller = module.get<GroupChatMessageController>(GroupChatMessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
