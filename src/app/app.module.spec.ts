import { fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import {
  MockBuilder,
  MockRender,
  NG_MOCKS_ROOT_PROVIDERS,
  ngMocks,
} from 'ng-mocks';
import { AppModule } from './app.module';
import { DashboardComponent, HeroesComponent } from './components';

describe('AppModule:Routing', () => {
  beforeEach(() => {
    return MockBuilder(
      [
        RouterModule,
        RouterTestingModule.withRoutes([]),
        NG_MOCKS_ROOT_PROVIDERS,
      ],
      AppModule
    );
  });

  it('renders /dashboard with DashboardComponent', fakeAsync(() => {
    const fixture = MockRender(RouterOutlet, {});
    const router: Router = fixture.point.injector.get(Router);
    const location = fixture.point.injector.get(Location);
    const route = '/dashboard';

    location.go(route);
    if (fixture.ngZone) {
      fixture.ngZone.run(() => router.initialNavigation());
      tick();
    }

    expect(location.path()).toBe(route);
    expect(() => ngMocks.find(DashboardComponent)).not.toThrow();
  }));

  it('renders /heroes with DashboardComponent', fakeAsync(() => {
    const fixture = MockRender(RouterOutlet, {});
    const router: Router = fixture.point.injector.get(Router);
    const location = fixture.point.injector.get(Location);
    const route = '/heroes';

    location.go(route);
    if (fixture.ngZone) {
      fixture.ngZone.run(() => router.initialNavigation());
      tick();
    }

    expect(location.path()).toBe(route);
    expect(() => ngMocks.find(HeroesComponent)).not.toThrow();
  }));
});
