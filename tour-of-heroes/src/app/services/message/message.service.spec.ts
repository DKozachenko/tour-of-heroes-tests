import { MockBuilder, MockRender } from 'ng-mocks';
import { MessageService } from './message.service';

describe('MessageService', () => {
  beforeEach(() => MockBuilder(MessageService));

  function createService(): MessageService {
    return MockRender(MessageService).point.componentInstance;
  }

  it('should has 0 messages while creating', () => {
    const service = createService();
    expect(service.messages).toHaveLength(0);
  });

  it('should add new message via "add" method', () => {
    const mockMessages = ['test message 1', 'test message 2'];

    const service = createService();
    service.messages = mockMessages.slice(0, mockMessages.length);
    const newMessage = 'test message 3';
    service.add(newMessage);
    expect(service.messages).toHaveLength(mockMessages.length + 1);
    expect(service.messages).toStrictEqual(mockMessages.concat([newMessage]));
  });

  it('should clear messages via "clear" method', () => {
    const mockMessages = ['test message 1', 'test message 2'];

    const service = createService();
    service.messages = mockMessages.slice(0, mockMessages.length);
    service.clear();
    expect(service.messages).toHaveLength(0);
  });
});
