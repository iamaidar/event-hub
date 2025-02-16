import { Test, TestingModule } from '@nestjs/testing';
import { GroupChatMessageService } from './group-chat-message.service';

describe('GroupChatMessageService', () => {
  let service: GroupChatMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupChatMessageService],
    }).compile();

    service = module.get<GroupChatMessageService>(GroupChatMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
