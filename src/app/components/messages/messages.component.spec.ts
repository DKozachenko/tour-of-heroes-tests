import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MockBuilder, MockRender, MockedComponentFixture } from 'ng-mocks';
import { mock, instance, when, verify } from 'ts-mockito';
import { MessageService } from '../../services';
import { MessagesComponent } from './messages.component';
import { AppModule } from '../../app.module';

class PageObject {
  private fixtureDebugElement: DebugElement;

  private getElementByAutomationId(id: string): DebugElement {
    return this.fixtureDebugElement.query(By.css(`[automation-id=${id}]`));
  }

  private getElementsByAutomationId(id: string): DebugElement[] {
    return this.fixtureDebugElement.queryAll(By.css(`[automation-id=${id}]`));
  }

  constructor(fixture: MockedComponentFixture<MessagesComponent>) {
    this.fixtureDebugElement = fixture.debugElement;
  }

  get divWrapper(): DebugElement {
    return this.getElementByAutomationId('wrapper');
  }

  get heading(): DebugElement {
    return this.getElementByAutomationId('heading');
  }

  get clearButton(): DebugElement {
    return this.getElementByAutomationId('clear-button');
  }

  get messages(): DebugElement[] {
    return this.getElementsByAutomationId('message');
  }
}

describe('MessagesComponent', () => {
  let mockMessageService: MessageService;

  beforeEach(() => {
    mockMessageService = mock(MessageService);

    return MockBuilder(MessagesComponent, AppModule).mock(
      MessageService,
      instance(mockMessageService)
    );
  });

  function createFixture(): MockedComponentFixture<MessagesComponent> {
    return MockRender(MessagesComponent);
  }

  function mockCalls(): void {
    when(mockMessageService.messages).thenReturn([]);
  }

  describe('Layout', () => {
    it('should not contain div wrapper if messages length equals 0', () => {
      mockCalls();

      const fixture = createFixture();
      const pageObject = new PageObject(fixture);
      expect(pageObject.divWrapper).toBeNull();
    });

    it('should contain div wrapper if messages length more than 0', () => {
      const mockedMessages = ['test message 1', 'test message 2'];
      when(mockMessageService.messages).thenReturn(mockedMessages);

      const fixture = createFixture();
      const pageObject = new PageObject(fixture);
      expect(pageObject.divWrapper).not.toBeNull();
      expect(pageObject.divWrapper.nativeElement).toMatchSnapshot();
    });

    it('should contain heading and clear button if messages length more than 0', () => {
      const mockedMessages = ['test message 1', 'test message 2'];
      when(mockMessageService.messages).thenReturn(mockedMessages);

      const fixture = createFixture();
      const pageObject = new PageObject(fixture);
      expect(pageObject.heading).not.toBeNull();
      expect(pageObject.heading.nativeElement).toMatchSnapshot();
      expect(pageObject.heading.nativeElement.textContent).toContain(
        'Messages'
      );
      expect(pageObject.clearButton).not.toBeNull();
      expect(pageObject.clearButton.nativeElement).toMatchSnapshot();
      expect(pageObject.clearButton.nativeElement.textContent).toContain(
        'Clear messages'
      );
    });

    it('should clear messages list if clear button has clicked', () => {
      let mockedMessages = ['test message 1', 'test message 2'];
      // We need to close the custom message array
      when(mockMessageService.messages).thenCall(() => mockedMessages);
      when(mockMessageService.clear()).thenCall(() => (mockedMessages = []));

      const fixture = createFixture();
      const pageObject = new PageObject(fixture);
      pageObject.clearButton.triggerEventHandler('click');
      fixture.detectChanges();
      verify(mockMessageService.clear()).once();
      expect(pageObject.divWrapper).toBeNull();
    });

    it('should contain messages list if messages length more than 0', () => {
      const mockedMessages = [
        'test message 1',
        'test message 2',
        'test message 3',
      ];
      when(mockMessageService.messages).thenReturn(mockedMessages);
      const fixture = createFixture();
      const pageObject = new PageObject(fixture);
      expect(pageObject.messages).not.toHaveLength(0);

      for (let i = 0; i < mockedMessages.length; ++i) {
        const messageDiv = pageObject.messages[i];
        const mockMessage = mockedMessages[i];
        expect(messageDiv.nativeElement.textContent).toContain(mockMessage);
        expect(messageDiv.nativeElement).toMatchSnapshot();
      }
    });
  });
});
