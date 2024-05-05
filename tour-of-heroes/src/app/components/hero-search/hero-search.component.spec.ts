import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { fakeAsync, discardPeriodicTasks, tick } from '@angular/core/testing';
import { MockBuilder, MockRender, MockedComponentFixture } from 'ng-mocks';
import { of } from 'rxjs';
import { mock, instance, when, anyString } from 'ts-mockito';
import { cold } from 'jest-marbles';
import { HeroService, HEROES } from '../../services';
import { Hero } from '../../models';
import { HeroSearchComponent } from './hero-search.component';
import { AppModule } from '../../app.module';

class PageObject {
  private fixtureDebugElement: DebugElement;

  constructor(fixture: MockedComponentFixture<HeroSearchComponent>) {
    this.fixtureDebugElement = fixture.debugElement;
  }

  get divWrapper(): DebugElement {
    return this.fixtureDebugElement.query(By.css('#search-component'));
  }

  get label(): DebugElement {
    return this.fixtureDebugElement.query(By.css('label'));
  }

  get input(): DebugElement {
    return this.fixtureDebugElement.query(By.css('input'));
  }

  get searchResult(): DebugElement {
    return this.fixtureDebugElement.query(By.css('.search-result'));
  }

  get heroLinks(): DebugElement[] {
    return this.searchResult.queryAll(By.css('li'));
  }
}

xdescribe('HeroSearchComponent', () => {
  let mockHeroService: HeroService;

  beforeEach(() => {
    mockHeroService = mock(HeroService);

    return MockBuilder(HeroSearchComponent, AppModule).mock(
      HeroService,
      instance(mockHeroService)
    );
  });

  function createFixture(): MockedComponentFixture<HeroSearchComponent> {
    return MockRender(HeroSearchComponent);
  }

  function createComponent(): HeroSearchComponent {
    return createFixture().point.componentInstance;
  }

  function mockCalls(): void {
    when(mockHeroService.searchHeroes(anyString())).thenReturn(of([]));
  }

  // Functional tests
  it('should define "heroes$" property as empty observable while creating', () => {
    mockCalls();
    const component = createComponent();
    expect(component.heroes$).toBeDefined();
    expect(component.heroes$).toBeObservable(cold(''));
  });

  it('should not change "heroes$" property values when "search" method called if less than 300ms has passed', fakeAsync(() => {
    const mockSearchedHeroes = [HEROES[0], HEROES[1]];
    when(mockHeroService.searchHeroes(anyString())).thenReturn(
      of(mockSearchedHeroes)
    );
    let heroValues: Hero[] = [];
    const component = createComponent();
    component.heroes$.subscribe((newHeroes) => (heroValues = newHeroes));
    component.search(anyString());

    tick();
    expect(heroValues).toStrictEqual([]);
    // Should use for clearing queue
    // https://stackoverflow.com/questions/43060886/angular-2-fakeasync-waiting-for-timeout-in-a-function-using-tick
    discardPeriodicTasks();
  }));

  it('should not change "heroes$" property values when "search" method called if new value is the same as previous (more than 300ms has passed)', fakeAsync(() => {
    const mockOldSearchedHeroes = [HEROES[0], HEROES[1]];
    when(mockHeroService.searchHeroes(anyString())).thenReturn(
      of(mockOldSearchedHeroes)
    );

    let heroValues: Hero[] = [];
    const component = createComponent();
    component.heroes$.subscribe((newHeroes) => (heroValues = newHeroes));

    const oldSearchValue1 = 'test 1';
    const newSearchValue2 = 'test 2';
    component.search(oldSearchValue1);
    tick(500);
    expect(heroValues).toStrictEqual(mockOldSearchedHeroes);

    const mockNewSearchedHeroes = [HEROES[1], HEROES[2]];
    when(mockHeroService.searchHeroes(anyString())).thenReturn(
      of(mockNewSearchedHeroes)
    );
    component.search(newSearchValue2);
    component.search(oldSearchValue1);
    tick(500);
    expect(heroValues).toStrictEqual(mockOldSearchedHeroes);
  }));

  it('should change "heroes$" property values when "search" method called (more than 300ms has passed and new value emitted)', fakeAsync(() => {
    const mockOldSearchedHeroes = [HEROES[0], HEROES[1]];

    when(mockHeroService.searchHeroes(anyString())).thenReturn(
      of(mockOldSearchedHeroes)
    );

    let heroValues: Hero[] = [];
    const component = createComponent();
    component.heroes$.subscribe((newHeroes) => (heroValues = newHeroes));

    const oldSearchValue1 = 'test 1';
    const newSearchValue2 = 'test 2';
    component.search(oldSearchValue1);
    tick(500);
    expect(heroValues).toStrictEqual(mockOldSearchedHeroes);

    const mockNewSearchedHeroes = [HEROES[1], HEROES[2]];
    when(mockHeroService.searchHeroes(anyString())).thenReturn(
      of(mockNewSearchedHeroes)
    );
    component.search(newSearchValue2);
    component.search(oldSearchValue1);
    component.search(newSearchValue2);
    tick(500);
    expect(heroValues).toStrictEqual(mockNewSearchedHeroes);
  }));

  // Layout tests
  it('should contain div wrapper', () => {
    mockCalls();
    const fixture = createFixture();
    const pageObject = new PageObject(fixture);
    expect(pageObject.divWrapper).not.toBeNull();
  });

  it('should contain label and input for typing', () => {
    mockCalls();
    const fixture = createFixture();
    const pageObject = new PageObject(fixture);
    expect(pageObject.label).not.toBeNull();
    expect(pageObject.input).not.toBeNull();
  });

  it('should call "search" component method while typing with input value', () => {
    mockCalls();
    const fixture = createFixture();
    const component = fixture.point.componentInstance;

    const pageObject = new PageObject(fixture);
    const spyOnSearch = jest.spyOn(component, 'search').mockReturnValue();

    const newInputValue = 'new input value';
    pageObject.input.nativeElement.value = newInputValue;
    pageObject.input.triggerEventHandler('input');
    expect(spyOnSearch).toHaveBeenCalled();
    expect(spyOnSearch).toHaveBeenCalledWith(newInputValue);
  });

  it('should contain hero list with hero names and hero id as routerLink attribute', () => {
    mockCalls();
    const fixture = createFixture();
    const component = fixture.point.componentInstance;
    const mockHeroes = HEROES.slice(0, 3);
    component.heroes$ = of(mockHeroes);
    fixture.detectChanges();

    const pageObject = new PageObject(fixture);
    expect(pageObject.searchResult).not.toBeNull();
    // TODO: есть toHaveLength
    expect(pageObject.heroLinks.length).toBe(mockHeroes.length);

    for (let i = 0; i < pageObject.heroLinks.length; ++i) {
      const heroLink = pageObject.heroLinks[i];
      const hero = mockHeroes[i];
      expect(heroLink.nativeElement.textContent).toContain(hero.name);
    }
  });

  it('should change hero list if new value has typed in input (more than 300ms has passed and new value emitted)', fakeAsync(() => {
    const mockOldSearchedHeroes = [HEROES[0], HEROES[1]];

    when(mockHeroService.searchHeroes(anyString())).thenReturn(
      of(mockOldSearchedHeroes)
    );

    const fixture = createFixture();
    const component = fixture.point.componentInstance;

    const oldSearchValue1 = 'test 1';
    component.search(oldSearchValue1);
    tick(500);
    fixture.detectChanges();

    const pageObject = new PageObject(fixture);
    expect(pageObject.searchResult).not.toBeNull();
    expect(pageObject.heroLinks.length).toBe(mockOldSearchedHeroes.length);

    for (let i = 0; i < pageObject.heroLinks.length; ++i) {
      const heroLink = pageObject.heroLinks[i];
      const hero = mockOldSearchedHeroes[i];
      expect(heroLink.nativeElement.textContent).toContain(hero.name);
    }

    const mockNewSearchedHeroes = [HEROES[2], HEROES[3], HEROES[4]];
    when(mockHeroService.searchHeroes(anyString())).thenReturn(
      of(mockNewSearchedHeroes)
    );

    const newSearchValue2 = 'test 2';
    component.search(newSearchValue2);
    tick(500);
    fixture.detectChanges();

    expect(pageObject.searchResult).not.toBeNull();
    expect(pageObject.heroLinks.length).toBe(mockNewSearchedHeroes.length);

    for (let i = 0; i < pageObject.heroLinks.length; ++i) {
      const heroLink = pageObject.heroLinks[i];
      const hero = mockNewSearchedHeroes[i];
      expect(heroLink.nativeElement.textContent).toContain(hero.name);
    }
  }));
});
