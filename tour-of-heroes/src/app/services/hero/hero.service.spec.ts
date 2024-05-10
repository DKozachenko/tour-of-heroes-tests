import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { HeroService } from './hero.service';
import { anything, instance, mock, verify } from 'ts-mockito';
import { HttpClientModule } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { MessageService } from '../message/message.service';
import { HEROES } from '../in-memory-data/in-memory-data.service';
import { Hero } from '../../models';

describe('HeroService', () => {
  let mockMessageService: MessageService;

  beforeEach(() => {
    mockMessageService = mock(MessageService);

    return MockBuilder(HeroService)
      .replace(HttpClientModule, HttpClientTestingModule)
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

  // getHeroes
  it('should return heroes and add message about fetching heroes via "getHeroes" method if request was successful', () => {
    const service = createService();
    const mockHttp = ngMocks.findInstance(HttpTestingController);

    let factHeroes: Hero[] = [];
    service.getHeroes().subscribe((value) => (factHeroes = value));

    const request = mockHttp.expectOne('api/heroes');

    request.flush(HEROES);
    expect(request.request.method).toBe('GET');
    expect(factHeroes).toStrictEqual(HEROES);
    verify(mockMessageService.add('HeroService: fetched heroes')).once();

    mockHttp.verify();
  });

  it('should return "undefined" and add message about error via "getHeroes" method if request has failed', () => {
    const service = createService();
    const mockHttp = ngMocks.findInstance(HttpTestingController);

    let factHeroes: Hero[] = [];
    service.getHeroes().subscribe((value) => (factHeroes = value));
    const spyOnConsole = jest.spyOn(console, 'error');

    const request = mockHttp.expectOne('api/heroes');
    request.error(new ProgressEvent(''));

    expect(factHeroes).toHaveLength(0);
    expect(spyOnConsole).toHaveBeenCalled();
    verify(
      mockMessageService.add(
        'HeroService: getHeroes failed: Http failure response for api/heroes: 0 '
      )
    ).once();

    mockHttp.verify();
  });

  // getHeroNo404
  it('should return hero and add message about fetching hero via "getHeroNo404" method if request was successful and id exists', () => {
    const service = createService();
    const mockHttp = ngMocks.findInstance(HttpTestingController);

    const existedHeroId = HEROES[0].id;
    const mockHero = HEROES[0];
    let factHero: Hero | undefined = undefined;
    service
      .getHeroNo404(existedHeroId)
      .subscribe((value) => (factHero = value));

    const request = mockHttp.expectOne(`api/heroes/?id=${existedHeroId}`);
    request.flush([mockHero]);
    expect(request.request.method).toBe('GET');
    expect(factHero).toEqual(mockHero);
    verify(
      mockMessageService.add(`HeroService: fetched hero id=${existedHeroId}`)
    ).once();

    mockHttp.verify();
  });

  it('should return undefined and add message about fetching non-existent hero via "getHeroNo404" method if request was successful and id does not exist', () => {
    const service = createService();
    const mockHttp = ngMocks.findInstance(HttpTestingController);

    const nonExistentHeroId = 0;
    let factHero: Hero | undefined = undefined;
    service
      .getHeroNo404(nonExistentHeroId)
      .subscribe((value) => (factHero = value));

    const request = mockHttp.expectOne(`api/heroes/?id=${nonExistentHeroId}`);
    request.flush([]);
    expect(factHero).toBeUndefined();
    verify(
      mockMessageService.add(
        `HeroService: did not find hero id=${nonExistentHeroId}`
      )
    ).once();

    mockHttp.verify();
  });

  it('should return undefined and add message about error via "getHeroNo404" method if request has failed', () => {
    const service = createService();
    const mockHttp = ngMocks.findInstance(HttpTestingController);

    const anyNumber = 0;
    let factHero: Hero | undefined = undefined;
    const spyOnConsole = jest.spyOn(console, 'error');

    service.getHeroNo404(anyNumber).subscribe((value) => (factHero = value));

    const request = mockHttp.expectOne(`api/heroes/?id=${anyNumber}`);
    request.error(new ProgressEvent(''));

    expect(factHero).toBeUndefined();
    expect(spyOnConsole).toHaveBeenCalled();
    verify(
      mockMessageService.add(
        `HeroService: getHero id=${anyNumber} failed: Http failure response for api/heroes/?id=${anyNumber}: 0 `
      )
    ).once();

    mockHttp.verify();
  });

  // getHero
  it('should return hero and add message about fetching hero via "getHero" method if request was successful and id exists', () => {
    const service = createService();
    // TODO: мб в beforeEach перенести
    const mockHttp = ngMocks.findInstance(HttpTestingController);

    const existedHeroId = HEROES[0].id;
    const mockHero = HEROES[0];
    let factHero: Hero | undefined = undefined;
    service.getHero(existedHeroId).subscribe((value) => (factHero = value));

    const request = mockHttp.expectOne(`api/heroes/${existedHeroId}`);
    request.flush(mockHero);
    expect(request.request.method).toBe('GET');
    expect(factHero).toEqual(mockHero);
    verify(
      mockMessageService.add(`HeroService: fetched hero id=${existedHeroId}`)
    ).once();

    mockHttp.verify();
  });

  it('should return undefined and add message about error via "getHero" method if request has failed', () => {
    const service = createService();
    const mockHttp = ngMocks.findInstance(HttpTestingController);

    const anyNumber = 0;
    let factHero: Hero | undefined = undefined;
    const spyOnConsole = jest.spyOn(console, 'error');

    service.getHero(anyNumber).subscribe((value) => (factHero = value));

    const request = mockHttp.expectOne(`api/heroes/${anyNumber}`);
    request.error(new ProgressEvent(''));

    expect(factHero).toBeUndefined();
    expect(spyOnConsole).toHaveBeenCalled();
    verify(
      mockMessageService.add(
        `HeroService: getHero id=${anyNumber} failed: Http failure response for api/heroes/${anyNumber}: 0 `
      )
    ).once();

    mockHttp.verify();
  });

  // searchHeroes
  it('should return empty array and does not make http request via "searchHeroes" method if search string is empty', () => {
    const service = createService();
    const mockHttp = ngMocks.findInstance(HttpTestingController);

    const searchString = '';
    let factHeroes: Hero[] = [];
    service
      .searchHeroes(searchString)
      .subscribe((value) => (factHeroes = value));

    mockHttp.expectNone(`api/heroes/?name=${searchString}`);
    expect(factHeroes).toHaveLength(0);
    verify(mockMessageService.add(anything())).never();

    mockHttp.verify();
  });

  it('should return empty array and does not make http request via "searchHeroes" method if search string contains only spaces', () => {
    const service = createService();
    const mockHttp = ngMocks.findInstance(HttpTestingController);

    const searchString = '      ';

    let factHeroes: Hero[] = [];
    service
      .searchHeroes(searchString)
      .subscribe((value) => (factHeroes = value));

    mockHttp.expectNone(`api/heroes/?name=${searchString}`);
    expect(factHeroes).toHaveLength(0);
    verify(mockMessageService.add(anything())).never();

    mockHttp.verify();
  });

  it('should return empty array and add message about non finding heroes via "searchHeroes" method if request was successful and no one hero does not contain search string in name', () => {
    const service = createService();
    const mockHttp = ngMocks.findInstance(HttpTestingController);

    const searchString = 'abracadabra';

    let factHeroes: Hero[] = [];
    service
      .searchHeroes(searchString)
      .subscribe((value) => (factHeroes = value));

    const request = mockHttp.expectOne(`api/heroes/?name=${searchString}`);
    request.flush([]);
    expect(factHeroes).toHaveLength(0);
    expect(request.request.method).toBe('GET');
    verify(
      mockMessageService.add(
        `HeroService: no heroes matching "${searchString}"`
      )
    ).once();

    mockHttp.verify();
  });

  it('should return appropriate heroes and add message about finding heroes via "searchHeroes" method if request was successful and at least one hero contains search string in name', () => {
    const service = createService();
    const mockHttp = ngMocks.findInstance(HttpTestingController);

    const searchString = 'ma';

    let factHeroes: Hero[] = [];
    service
      .searchHeroes(searchString)
      .subscribe((value) => (factHeroes = value));

    const searchedHeroes = [HEROES[3], HEROES[4], HEROES[5], HEROES[7]];
    const request = mockHttp.expectOne(`api/heroes/?name=${searchString}`);
    request.flush(searchedHeroes);
    expect(factHeroes).toHaveLength(searchedHeroes.length);
    expect(factHeroes).toStrictEqual(searchedHeroes);
    expect(request.request.method).toBe('GET');
    verify(
      mockMessageService.add(
        `HeroService: found heroes matching "${searchString}"`
      )
    ).once();

    mockHttp.verify();
  });

  it('should return empty array and add message about error via "searchHeroes" method if request has failed', () => {
    const service = createService();
    const mockHttp = ngMocks.findInstance(HttpTestingController);

    const searchString = 'abracadabra';
    let factHeroes: Hero[] = [];
    const spyOnConsole = jest.spyOn(console, 'error');

    service
      .searchHeroes(searchString)
      .subscribe((value) => (factHeroes = value));

    const request = mockHttp.expectOne(`api/heroes/?name=${searchString}`);
    request.error(new ProgressEvent(''));

    expect(factHeroes).toHaveLength(0);
    expect(spyOnConsole).toHaveBeenCalled();
    verify(
      mockMessageService.add(
        `HeroService: searchHeroes failed: Http failure response for api/heroes/?name=${searchString}: 0 `
      )
    ).once();

    mockHttp.verify();
  });

  // addHero
  it('should return new hero and add message about hero addition via "addHero" method if request was successful', () => {
    const service = createService();
    const mockHttp = ngMocks.findInstance(HttpTestingController);

    const newHero = {
      name: 'test',
    };
    let factHero: Hero | undefined = undefined;
    service.addHero(newHero as Hero).subscribe((value) => (factHero = value));

    const expectedHero = {
      ...newHero,
      id: 11 + HEROES.length + 1,
    };
    const request = mockHttp.expectOne('api/heroes');
    request.flush(expectedHero);

    expect(factHero).toEqual(expectedHero);
    expect(request.request.method).toBe('POST');
    expect(request.request.headers.get('Content-Type')).toBe(
      'application/json'
    );
    verify(
      mockMessageService.add(`HeroService: added hero w/ id=${expectedHero.id}`)
    ).once();

    mockHttp.verify();
  });

  it('should return undefined and add message about error via "addHero" method if request has failed', () => {
    const service = createService();
    const mockHttp = ngMocks.findInstance(HttpTestingController);

    let factHero: Hero | undefined = undefined;
    const spyOnConsole = jest.spyOn(console, 'error');

    service.addHero(anything()).subscribe((value) => (factHero = value));

    const request = mockHttp.expectOne('api/heroes');
    request.error(new ProgressEvent(''));

    expect(factHero).toBeUndefined();
    expect(spyOnConsole).toHaveBeenCalled();
    expect(request.request.headers.get('Content-Type')).toBe(
      'application/json'
    );
    verify(
      mockMessageService.add(
        `HeroService: addHero failed: Http failure response for api/heroes: 0 `
      )
    ).once();

    mockHttp.verify();
  });

  // deleteHero
  it('should return removed hero and add message about hero deletion via "deleteHero" method if request was successful', () => {
    const service = createService();
    const mockHttp = ngMocks.findInstance(HttpTestingController);

    const existedHeroId = 11;
    let factHero: Hero | undefined = undefined;
    service.deleteHero(existedHeroId).subscribe((value) => (factHero = value));

    const expectedHero = HEROES[0];
    const request = mockHttp.expectOne(`api/heroes/${existedHeroId}`);
    request.flush(expectedHero);

    expect(factHero).toEqual(expectedHero);
    expect(request.request.method).toBe('DELETE');
    expect(request.request.headers.get('Content-Type')).toBe(
      'application/json'
    );
    verify(
      mockMessageService.add(`HeroService: deleted hero id=${existedHeroId}`)
    ).once();

    mockHttp.verify();
  });

  it('should return undefined add message about error via "deleteHero" method if request was failed', () => {
    const service = createService();
    const mockHttp = ngMocks.findInstance(HttpTestingController);

    const existedHeroId = 11;
    let factHero: Hero | undefined = undefined;
    const spyOnConsole = jest.spyOn(console, 'error');
    service.deleteHero(existedHeroId).subscribe((value) => (factHero = value));

    const request = mockHttp.expectOne(`api/heroes/${existedHeroId}`);
    request.error(new ProgressEvent(''));

    expect(factHero).toBeUndefined();
    expect(spyOnConsole).toHaveBeenCalled();
    expect(request.request.headers.get('Content-Type')).toBe(
      'application/json'
    );
    verify(
      mockMessageService.add(
        `HeroService: deleteHero failed: Http failure response for api/heroes/${existedHeroId}: 0 `
      )
    ).once();

    mockHttp.verify();
  });

  // updateHero
  it('should return updated hero and add message about hero updating via "updateHero" method if request was successful', () => {
    const service = createService();
    const mockHttp = ngMocks.findInstance(HttpTestingController);

    const updatedHero = {
      ...HEROES[0],
      name: 'new name',
    };
    let factHero: Hero | undefined = undefined;
    service.updateHero(updatedHero).subscribe((value) => (factHero = value));

    const request = mockHttp.expectOne('api/heroes');
    request.flush(updatedHero);

    expect(factHero).toEqual(updatedHero);
    expect(request.request.method).toBe('PUT');
    expect(request.request.headers.get('Content-Type')).toBe(
      'application/json'
    );
    verify(
      mockMessageService.add(`HeroService: updated hero id=${updatedHero.id}`)
    ).once();

    mockHttp.verify();
  });

  it('should return undefined add message about error via "updateHero" method if request was failed', () => {
    const service = createService();
    const mockHttp = ngMocks.findInstance(HttpTestingController);

    let factHero: Hero | undefined = undefined;
    let spyOnConsole = jest.spyOn(console, 'error');
    service.updateHero(anything()).subscribe((value) => (factHero = value));

    const request = mockHttp.expectOne('api/heroes');
    request.error(new ProgressEvent(''));

    expect(factHero).toBeUndefined();
    expect(spyOnConsole).toHaveBeenCalled();
    expect(request.request.headers.get('Content-Type')).toBe(
      'application/json'
    );
    verify(
      mockMessageService.add(
        `HeroService: updateHero failed: Http failure response for api/heroes: 0 `
      )
    ).once();

    mockHttp.verify();
  });
});
