import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import {
  MockBuilder,
  MockRender,
  MockedComponentFixture,
  NG_MOCKS_ROOT_PROVIDERS,
} from 'ng-mocks';
import { of } from 'rxjs';
import { mock, instance, when, verify } from 'ts-mockito';
import { HeroService, HEROES } from '../../services';
import { DashboardComponent } from './dashboard.component';
import { AppModule } from '../../../app/app.module';

class PageObject {
  private fixtureDebugElement: DebugElement;

  private getElementByAutomationId(id: string): DebugElement {
    return this.fixtureDebugElement.query(By.css(`[automation-id=${id}]`));
  }

  private getElementsByAutomationId(id: string): DebugElement[] {
    return this.fixtureDebugElement.queryAll(By.css(`[automation-id=${id}]`));
  }

  constructor(fixture: MockedComponentFixture<DashboardComponent>) {
    this.fixtureDebugElement = fixture.debugElement;
  }

  get heading(): DebugElement {
    return this.getElementByAutomationId('heading');
  }

  get heroesMenu(): DebugElement {
    return this.getElementByAutomationId('heroes-menu');
  }

  get heroLinks(): DebugElement[] {
    return this.getElementsByAutomationId('hero-link');
  }

  get heroSearch(): DebugElement {
    return this.getElementByAutomationId('hero-search');
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
    when(mockHeroService.getHeroes()).thenReturn(
      of(HEROES.slice(0, HEROES.length))
    );
  }

  describe('Functional', () => {
    describe('getHeroes', () => {
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
    });

    it('should get 4 heroes (from 1 to 5 excluding) while creating', () => {
      mockCalls();
      const component = createComponent();
      const expectedHeroes = HEROES.slice(1, 5);

      expect(component.heroes).toHaveLength(4);
      expect(component.heroes).toStrictEqual(expectedHeroes);
    });
  });

  describe('Layout', () => {
    it('should contain heading with "Top Heroes" title', () => {
      mockCalls();
      const fixture = createFixture();
      const pageObject = new PageObject(fixture);
      expect(pageObject.heading).not.toBeNull();
      expect(pageObject.heading.nativeElement.textContent).toBe('Top Heroes');
      expect(pageObject.heading.nativeElement).toMatchSnapshot();
    });

    it('should contain heroes list including 4 links with hero names and hero id as routerLink attribute', () => {
      mockCalls();
      const fixture = createFixture();
      const pageObject = new PageObject(fixture);
      expect(pageObject.heroesMenu).not.toBeNull();
      expect(pageObject.heroesMenu.nativeElement).toMatchSnapshot();
      expect(pageObject.heroLinks).toHaveLength(4);

      const expectedHeroes = HEROES.slice(1, 5);
      for (let i = 0; i < pageObject.heroLinks.length; ++i) {
        const heroLink = pageObject.heroLinks[i];
        const hero = expectedHeroes[i];
        expect(heroLink.nativeElement.textContent).toContain(hero.name);
        expect(heroLink.injector.get(RouterLink).routerLink).toBe(
          `/detail/${hero.id}`
        );
        expect(heroLink.nativeElement).toMatchSnapshot();
      }
    });

    it('should contain "app-hero-search" component', () => {
      mockCalls();
      const fixture = createFixture();
      const pageObject = new PageObject(fixture);
      expect(pageObject.heroSearch).not.toBeNull();
      expect(pageObject.heroSearch.nativeElement).toMatchSnapshot();
    });
  });
});

// https://ng-mocks.sudo.eu/guides/route/
describe('DashboardComponent:Routing', () => {
  let mockHeroService: HeroService;

  beforeEach(() => {
    mockHeroService = mock(HeroService);

    return MockBuilder(
      [
        DashboardComponent,
        RouterModule,
        RouterTestingModule.withRoutes([]),
        NG_MOCKS_ROOT_PROVIDERS,
      ],
      AppModule
    ).mock(HeroService, instance(mockHeroService));
  });

  function createFixture(): MockedComponentFixture<DashboardComponent> {
    return MockRender(DashboardComponent);
  }

  function mockCalls(): void {
    when(mockHeroService.getHeroes()).thenReturn(
      of(HEROES.slice(0, HEROES.length))
    );
  }

  it('should change location if appropriate hero link has clicked', fakeAsync(() => {
    mockCalls();
    const fixture = createFixture();
    const router = fixture.point.injector.get(Router);
    const location = fixture.point.injector.get(Location);

    if (fixture.ngZone) {
      fixture.ngZone.run(() => router.initialNavigation());
      tick();
    }

    const pageObject = new PageObject(fixture);
    for (let i = 0; i < pageObject.heroLinks.length; ++i) {
      const heroLink = pageObject.heroLinks[i];
      if (fixture.ngZone) {
        fixture.ngZone.run(() => {
          heroLink.triggerEventHandler('click', {
            button: 0,
          });
        });
        tick();
      }

      expect(location.path()).toBe(heroLink.injector.get(RouterLink).href);
    }
  }));
});
