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
  ngMocks,
} from 'ng-mocks';
import { AppComponent } from './app.component';
import { AppModule } from '../../app.module';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { HeroesComponent } from '../heroes/heroes.component';

class PageObject {
  private fixtureDebugElement: DebugElement;

  private getElementByAutomationId(id: string): DebugElement {
    return this.fixtureDebugElement.query(By.css(`[automation-id=${id}]`));
  }

  private getElementsByAutomationId(id: string): DebugElement[] {
    return this.fixtureDebugElement.queryAll(By.css(`[automation-id=${id}]`));
  }

  constructor(fixture: MockedComponentFixture<AppComponent>) {
    this.fixtureDebugElement = fixture.debugElement;
  }

  get heading(): DebugElement {
    return this.getElementByAutomationId('heading');
  }

  get navigation(): DebugElement {
    return this.getElementByAutomationId('navigation');
  }

  get links(): DebugElement[] {
    return this.getElementsByAutomationId('navigation-link');
  }

  get messages(): DebugElement {
    return this.getElementByAutomationId('messages');
  }
}

const LINKS = [
  {
    text: 'Dashboard',
    url: '/dashboard',
  },
  {
    text: 'Heroes',
    url: '/heroes',
  },
];

describe('AppComponent', () => {
  beforeEach(() => {
    return MockBuilder(AppComponent, AppModule);
  });

  function createFixture(): MockedComponentFixture<AppComponent> {
    return MockRender(AppComponent);
  }

  describe('Layout', () => {
    it('should contain heading with "Tour of Heroes" title', () => {
      const fixture = createFixture();
      const pageObject = new PageObject(fixture);
      expect(pageObject.heading).not.toBeNull();
      expect(pageObject.heading.nativeElement.textContent).toBe(
        'Tour of Heroes'
      );
      expect(pageObject.heading.nativeElement).toMatchSnapshot();
    });

    it('should contain navigation with links', () => {
      const fixture = createFixture();
      const pageObject = new PageObject(fixture);
      expect(pageObject.navigation).not.toBeNull();
      expect(pageObject.links).toHaveLength(LINKS.length);
      expect(pageObject.navigation.nativeElement).toMatchSnapshot();

      for (let i = 0; i < pageObject.links.length; ++i) {
        const navigationLink = pageObject.links[i];
        const link = LINKS[i];
        expect(navigationLink.nativeElement.textContent).toBe(link.text);
        expect(navigationLink.injector.get(RouterLink).routerLink).toBe(
          link.url
        );
        expect(navigationLink.nativeElement).toMatchSnapshot();
      }
    });

    it('should contain "app-messages" component', () => {
      const fixture = createFixture();
      const pageObject = new PageObject(fixture);
      expect(pageObject.messages).not.toBeNull();
      expect(pageObject.messages.nativeElement).toMatchSnapshot();
    });
  });
});

describe('AppComponent:Routing', () => {
  beforeEach(() => {
    return MockBuilder(
      [
        AppComponent,
        RouterModule,
        RouterTestingModule.withRoutes([]),
        NG_MOCKS_ROOT_PROVIDERS,
      ],
      AppModule
    );
  });

  function createFixture(): MockedComponentFixture<AppComponent> {
    return MockRender(AppComponent);
  }

  it('should change location if appropriate hero link has clicked', fakeAsync(() => {
    const fixture = createFixture();
    const router = fixture.point.injector.get(Router);
    const location = fixture.point.injector.get(Location);

    if (fixture.ngZone) {
      fixture.ngZone.run(() => router.initialNavigation());
      tick();
    }

    expect(location.path()).toBe(LINKS[0].url);
    expect(() => ngMocks.find(DashboardComponent)).not.toThrow();
    expect(() => ngMocks.find(HeroesComponent)).toThrow();

    const pageObject = new PageObject(fixture);
    for (let i = 0; i < pageObject.links.length; ++i) {
      const navigationLink = pageObject.links[i];

      if (fixture.ngZone) {
        fixture.ngZone.run(() => {
          navigationLink.triggerEventHandler('click', {
            button: 0,
          });
        });
        tick();
      }

      expect(location.path()).toBe(
        navigationLink.injector.get(RouterLink).href
      );
      if (i === 0) {
        expect(() => ngMocks.find(DashboardComponent)).not.toThrow();
      } else if (i === 1) {
        expect(() => ngMocks.find(HeroesComponent)).not.toThrow();
      }
    }
  }));
});
