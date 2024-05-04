import { DebugElement } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MockBuilder, MockRender, MockedComponentFixture } from 'ng-mocks';
import { of } from 'rxjs';
import { mock, instance, when, verify } from 'ts-mockito';
import { HeroService, HEROES } from '../../services';
import { DashboardComponent } from './dashboard.component';
import { AppModule } from '../../../app/app.module';
import { By } from '@angular/platform-browser';
import { HeroSearchComponent } from '../hero-search/hero-search.component';

class PageObject {
  private fixtureDebugElement: DebugElement;

  constructor(fixture: MockedComponentFixture<DashboardComponent>) {
    this.fixtureDebugElement = fixture.debugElement;
  }

  get heading(): DebugElement {
    return this.fixtureDebugElement.query(By.css('h2'));
  }

  get heroesMenu(): DebugElement {
    return this.fixtureDebugElement.query(By.css('.heroes-menu'));
  }

  get heroesLinks(): DebugElement[] {
    return this.heroesMenu.queryAll(By.css('a'));
  }

  get heroSearch(): DebugElement {
    return this.fixtureDebugElement.query(By.directive(HeroSearchComponent));
  }
}

describe('DashboardComponent', () => {
  let mockHeroService: HeroService;

  beforeEach(() => {
    mockHeroService = mock(HeroService);

    return MockBuilder(DashboardComponent, AppModule).mock(
      HeroService,
      instance(mockHeroService)
    );
  });

  function createFixture(): MockedComponentFixture<DashboardComponent> {
    return MockRender(DashboardComponent);
  }

  function createComponent(): DashboardComponent {
    return createFixture().point.componentInstance;
  }

  function mockCalls(): void {
    when(mockHeroService.getHeroes()).thenReturn(of(HEROES));
  }

  // Function tests
  it('should call "getHeroes" service method while creating', () => {
    mockCalls();
    createComponent();
    verify(mockHeroService.getHeroes()).once();
  });

  it('should call "getHeroes" service method via "getHeroes" component method', () => {
    mockCalls();
    const component = createComponent();
    component.getHeroes();
    verify(mockHeroService.getHeroes()).twice();
  });

  it('should get 4 heroes (from 1 to 5 excluding) while creating', () => {
    mockCalls();
    const component = createComponent();
    const expectedHeroes = HEROES.slice(1, 5);

    expect(component.heroes.length).toBe(4);
    expect(component.heroes).toStrictEqual(expectedHeroes);
  });

  // Layout tests
  it('should contain heading with "Top Heroes" title', () => {
    mockCalls();
    const fixture = createFixture();
    const pageObject = new PageObject(fixture);
    expect(pageObject.heading).not.toBeNull();
    expect(pageObject.heading.nativeElement.textContent).toBe('Top Heroes');
  });

  it('should contain heroes list including 4 links with hero names and hero id as routerLink attribute', () => {
    mockCalls();
    const fixture = createFixture();
    const pageObject = new PageObject(fixture);
    expect(pageObject.heroesMenu).not.toBeNull();
    expect(pageObject.heroesLinks.length).toBe(4);

    const expectedHeroes = HEROES.slice(1, 5);
    for (let i = 0; i < pageObject.heroesLinks.length; ++i) {
      const heroLink = pageObject.heroesLinks[i];
      const hero = expectedHeroes[i];
      expect(heroLink.nativeElement.textContent).toContain(hero.name);
      expect(heroLink.injector.get(RouterLink).routerLink).toBe(
        `/detail/${hero.id}`
      );
    }
  });

  it('should contain "app-hero-search" component', () => {
    mockCalls();
    const fixture = createFixture();
    const pageObject = new PageObject(fixture);
    expect(pageObject.heroSearch).not.toBeNull();
  });
});
