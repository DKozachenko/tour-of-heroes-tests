import { MockBuilder, MockRender } from 'ng-mocks';
import {
  anyNumber,
  anyOfClass,
  anyString,
  anything,
  deepEqual,
  instance,
  mock,
  verify,
  when,
} from 'ts-mockito';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { cold } from 'jest-marbles';
import { throwError } from 'rxjs';
import { MessageService } from '../message/message.service';
import { HeroService } from './hero.service';
import { HEROES } from '../in-memory-data/in-memory-data.service';
import { Hero } from '../../models';

describe('HeroService', () => {
  let mockMessageService: MessageService;
  let mockHttp: HttpClient;

  beforeEach(() => {
    mockMessageService = mock(MessageService);
    mockHttp = mock(HttpClient);

    return MockBuilder(HeroService)
      .mock(HttpClient, instance(mockHttp))
      .mock(MessageService, instance(mockMessageService));
  });

  function createService(): HeroService {
    return MockRender(HeroService).point.componentInstance;
  }

  it('should contain http header "Content-Type"', () => {
    const service = createService();
    expect(service.httpOptions.headers.get('Content-Type')).toBe(
      'application/json'
    );
  });

  describe('getHeroes', () => {
    it('should return heroes and add message about fetching heroes via "getHeroes" method if request was successful', () => {
      when(mockHttp.get('api/heroes')).thenReturn(
        cold('a', {
          a: HEROES,
        })
      );
      const service = createService();

      expect(service.getHeroes()).toBeObservable(
        cold('a', {
          a: HEROES,
        })
      );
      expect(service.getHeroes()).toSatisfyOnFlush(() => {
        // twice потому что в прошлом expect также создается подписка
        verify(mockMessageService.add('HeroService: fetched heroes')).twice();
      });
    });

    it('should return empty array and add message about error via "getHeroes" method if request has failed', () => {
      const mockError = new HttpErrorResponse({
        url: 'api/heroes',
        status: 500,
        statusText: 'server error',
      });
      when(mockHttp.get('api/heroes')).thenReturn(throwError(() => mockError));
      const spyOnConsole = jest.spyOn(console, 'error');
      const service = createService();

      expect(service.getHeroes()).toBeObservable(
        cold('(a|)', {
          a: [],
        })
      );
      expect(service.getHeroes()).toSatisfyOnFlush(() => {
        verify(
          mockMessageService.add(
            `HeroService: getHeroes failed: ${mockError.message}`
          )
        ).twice();
        expect(spyOnConsole).toHaveBeenCalled();
      });
    });
  });

  describe('getHeroNo404', () => {
    it('should return hero and add message about fetching hero via "getHeroNo404" method if request was successful and id exists', () => {
      const existedHeroId = HEROES[0].id;
      const mockHero = HEROES[0];
      when(mockHttp.get(`api/heroes/?id=${existedHeroId}`)).thenReturn(
        cold('a', {
          a: [mockHero],
        })
      );
      const service = createService();

      expect(service.getHeroNo404(existedHeroId)).toBeObservable(
        cold('a', {
          a: mockHero,
        })
      );
      expect(service.getHeroNo404(existedHeroId)).toSatisfyOnFlush(() => {
        verify(
          mockMessageService.add(
            `HeroService: fetched hero id=${existedHeroId}`
          )
        ).twice();
      });
    });

    it('should return undefined and add message about fetching non-existent hero via "getHeroNo404" method if request was successful and id does not exist', () => {
      const nonExistentHeroId = 0;
      when(mockHttp.get(`api/heroes/?id=${nonExistentHeroId}`)).thenReturn(
        cold('a', {
          a: [],
        })
      );
      const service = createService();

      expect(service.getHeroNo404(nonExistentHeroId)).toBeObservable(
        cold('a', {
          a: undefined,
        })
      );
      expect(service.getHeroNo404(nonExistentHeroId)).toSatisfyOnFlush(() => {
        verify(
          mockMessageService.add(
            `HeroService: did not find hero id=${nonExistentHeroId}`
          )
        ).twice();
      });
    });

    it('should return undefined and add message about error via "getHeroNo404" method if request has failed', () => {
      const id = anyNumber();
      const mockError = new HttpErrorResponse({
        url: `api/heroes?id=${id}`,
        status: 500,
        statusText: 'server error',
      });
      when(mockHttp.get(`api/heroes/?id=${id}`)).thenReturn(
        throwError(() => mockError)
      );
      const spyOnConsole = jest.spyOn(console, 'error');
      const service = createService();

      expect(service.getHeroNo404(id)).toBeObservable(
        cold('(a|)', {
          a: undefined,
        })
      );
      expect(service.getHeroNo404(id)).toSatisfyOnFlush(() => {
        verify(
          mockMessageService.add(
            `HeroService: getHero id=${id} failed: ${mockError.message}`
          )
        ).twice();
        expect(spyOnConsole).toHaveBeenCalled();
      });
    });
  });

  describe('getHero', () => {
    it('should return hero and add message about fetching hero via "getHero" method if request was successful and id exists', () => {
      const existedHeroId = HEROES[0].id;
      const mockHero = HEROES[0];
      when(mockHttp.get(`api/heroes/${existedHeroId}`)).thenReturn(
        cold('a', {
          a: mockHero,
        })
      );
      const service = createService();

      expect(service.getHero(existedHeroId)).toBeObservable(
        cold('a', {
          a: mockHero,
        })
      );
      expect(service.getHero(existedHeroId)).toSatisfyOnFlush(() => {
        verify(
          mockMessageService.add(
            `HeroService: fetched hero id=${existedHeroId}`
          )
        ).twice();
      });
    });

    it('should return undefined and add message about error via "getHero" method if request has failed', () => {
      const nonExistentHeroId = 0;
      const mockError = new HttpErrorResponse({
        url: `api/heroes?id=${nonExistentHeroId}`,
        status: 500,
        statusText: 'server error',
      });
      when(mockHttp.get(`api/heroes/${nonExistentHeroId}`)).thenReturn(
        throwError(() => mockError)
      );
      const spyOnConsole = jest.spyOn(console, 'error');
      const service = createService();

      expect(service.getHero(nonExistentHeroId)).toBeObservable(
        cold('(a|)', {
          a: undefined,
        })
      );
      expect(service.getHero(nonExistentHeroId)).toSatisfyOnFlush(() => {
        verify(
          mockMessageService.add(
            `HeroService: getHero id=${nonExistentHeroId} failed: ${mockError.message}`
          )
        ).twice();
        expect(spyOnConsole).toHaveBeenCalled();
      });
    });
  });

  describe('searchHeroes', () => {
    it('should return empty array and does not make http request via "searchHeroes" method if search string is empty', () => {
      const searchString = '';
      const service = createService();

      expect(service.searchHeroes(searchString)).toBeObservable(
        cold('(a|)', {
          a: [],
        })
      );
      expect(service.searchHeroes(searchString)).toSatisfyOnFlush(() => {
        verify(mockMessageService.add(anyString())).never();
      });
      verify(mockHttp.get(anyString())).never();
    });

    it('should return empty array and does not make http request via "searchHeroes" method if search string contains only spaces', () => {
      const searchString = '      ';
      const service = createService();

      expect(service.searchHeroes(searchString)).toBeObservable(
        cold('(a|)', {
          a: [],
        })
      );
      expect(service.searchHeroes(searchString)).toSatisfyOnFlush(() => {
        verify(mockMessageService.add(anyString())).never();
      });
      verify(mockHttp.get(anyString())).never();
    });

    it('should return empty array and add message about non finding heroes via "searchHeroes" method if request was successful and no one hero does not contain search string in name', () => {
      const searchString = 'abracadabra';
      when(mockHttp.get(`api/heroes/?name=${searchString}`)).thenReturn(
        cold('a', {
          a: [],
        })
      );
      const service = createService();

      expect(service.searchHeroes(searchString)).toBeObservable(
        cold('a', {
          a: [],
        })
      );
      expect(service.searchHeroes(searchString)).toSatisfyOnFlush(() => {
        verify(
          mockMessageService.add(
            `HeroService: no heroes matching "${searchString}"`
          )
        ).twice();
      });
    });

    it('should return appropriate heroes and add message about finding heroes via "searchHeroes" method if request was successful and at least one hero contains search string in name', () => {
      const searchString = 'ma';
      const searchedHeroes = [HEROES[3], HEROES[4], HEROES[5], HEROES[7]];
      when(mockHttp.get(`api/heroes/?name=${searchString}`)).thenReturn(
        cold('a', {
          a: searchedHeroes,
        })
      );
      const service = createService();

      expect(service.searchHeroes(searchString)).toBeObservable(
        cold('a', {
          a: searchedHeroes,
        })
      );
      expect(service.searchHeroes(searchString)).toSatisfyOnFlush(() => {
        verify(
          mockMessageService.add(
            `HeroService: found heroes matching "${searchString}"`
          )
        ).twice();
      });
    });

    it('should return empty array and add message about error via "searchHeroes" method if request has failed', () => {
      const searchString = 'abracadabra';
      const mockError = new HttpErrorResponse({
        url: `api/heroes?name=${searchString}`,
        status: 500,
        statusText: 'server error',
      });
      when(mockHttp.get(`api/heroes/?name=${searchString}`)).thenReturn(
        throwError(() => mockError)
      );
      const spyOnConsole = jest.spyOn(console, 'error');
      const service = createService();

      expect(service.searchHeroes(searchString)).toBeObservable(
        cold('(a|)', {
          a: [],
        })
      );
      expect(service.searchHeroes(searchString)).toSatisfyOnFlush(() => {
        verify(
          mockMessageService.add(
            `HeroService: searchHeroes failed: ${mockError.message}`
          )
        ).twice();
        expect(spyOnConsole).toHaveBeenCalled();
      });
    });
  });

  describe('addHero', () => {
    it('should return new hero and add message about hero addition via "addHero" method if request was successful', () => {
      const newHero = {
        name: 'test',
      };
      const expectedHero = {
        ...newHero,
        id: 11 + HEROES.length + 1,
      };
      when(
        mockHttp.post(
          'api/heroes',
          newHero,
          deepEqual({
            headers: anyOfClass(HttpHeaders),
          })
        )
      ).thenReturn(
        cold('a', {
          a: expectedHero,
        })
      );
      const service = createService();

      expect(service.addHero(newHero as Hero)).toBeObservable(
        cold('a', {
          a: expectedHero,
        })
      );
      expect(service.addHero(newHero as Hero)).toSatisfyOnFlush(() => {
        verify(
          mockMessageService.add(
            `HeroService: added hero w/ id=${expectedHero.id}`
          )
        ).twice();
      });
    });

    it('should return undefined and add message about error via "addHero" method if request has failed', () => {
      const mockError = new HttpErrorResponse({
        url: 'api/heroes',
        status: 500,
        statusText: 'server error',
      });
      when(mockHttp.post('api/heroes', anything(), anything())).thenReturn(
        throwError(() => mockError)
      );
      const spyOnConsole = jest.spyOn(console, 'error');
      const service = createService();

      expect(service.addHero(anything())).toBeObservable(
        cold('(a|)', {
          a: undefined,
        })
      );
      expect(service.addHero(anything())).toSatisfyOnFlush(() => {
        verify(
          mockMessageService.add(
            `HeroService: addHero failed: ${mockError.message}`
          )
        ).twice();
        expect(spyOnConsole).toHaveBeenCalled();
      });
    });
  });

  describe('deleteHero', () => {
    it('should return removed hero and add message about hero deletion via "deleteHero" method if request was successful', () => {
      const existedHeroId = 11;
      const expectedHero = HEROES[0];
      when(
        mockHttp.delete(
          `api/heroes/${existedHeroId}`,
          deepEqual({
            headers: anyOfClass(HttpHeaders),
          })
        )
      ).thenReturn(
        cold('a', {
          a: expectedHero,
        })
      );
      const service = createService();

      expect(service.deleteHero(existedHeroId)).toBeObservable(
        cold('a', {
          a: expectedHero,
        })
      );
      expect(service.deleteHero(existedHeroId)).toSatisfyOnFlush(() => {
        verify(
          mockMessageService.add(
            `HeroService: deleted hero id=${existedHeroId}`
          )
        ).twice();
      });
    });

    it('should return undefined add message about error via "deleteHero" method if request was failed', () => {
      const id = anyNumber();
      const mockError = new HttpErrorResponse({
        url: `api/heroes/${id}`,
        status: 500,
        statusText: 'server error',
      });
      when(mockHttp.delete(`api/heroes/${id}`, anything())).thenReturn(
        throwError(() => mockError)
      );
      const spyOnConsole = jest.spyOn(console, 'error');
      const service = createService();

      expect(service.deleteHero(id)).toBeObservable(
        cold('(a|)', {
          a: undefined,
        })
      );
      expect(service.deleteHero(id)).toSatisfyOnFlush(() => {
        verify(
          mockMessageService.add(
            `HeroService: deleteHero failed: ${mockError.message}`
          )
        ).twice();
        expect(spyOnConsole).toHaveBeenCalled();
      });
    });
  });

  describe('updateHero', () => {
    it('should return updated hero and add message about hero updating via "updateHero" method if request was successful', () => {
      const updatedHero = {
        ...HEROES[0],
        name: 'new name',
      };
      when(
        mockHttp.put(
          'api/heroes',
          updatedHero,
          deepEqual({
            headers: anyOfClass(HttpHeaders),
          })
        )
      ).thenReturn(
        cold('a', {
          a: updatedHero,
        })
      );
      const service = createService();

      expect(service.updateHero(updatedHero)).toBeObservable(
        cold('a', {
          a: updatedHero,
        })
      );
      expect(service.updateHero(updatedHero)).toSatisfyOnFlush(() => {
        verify(
          mockMessageService.add(
            `HeroService: updated hero id=${updatedHero.id}`
          )
        ).twice();
      });
    });

    it('should return undefined add message about error via "updateHero" method if request was failed', () => {
      const mockError = new HttpErrorResponse({
        url: 'api/heroes',
        status: 500,
        statusText: 'server error',
      });
      when(mockHttp.put('api/heroes', anything(), anything())).thenReturn(
        throwError(() => mockError)
      );
      const spyOnConsole = jest.spyOn(console, 'error');
      const service = createService();

      expect(service.updateHero(anything())).toBeObservable(
        cold('(a|)', {
          a: undefined,
        })
      );
      expect(service.updateHero(anything())).toSatisfyOnFlush(() => {
        verify(
          mockMessageService.add(
            `HeroService: updateHero failed: ${mockError.message}`
          )
        ).twice();
        expect(spyOnConsole).toHaveBeenCalled();
      });
    });
  });
});
