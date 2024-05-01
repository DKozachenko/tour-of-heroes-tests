import { MockBuilder, MockRender } from 'ng-mocks';
import { of } from 'rxjs';
import { mock, instance, when, verify } from 'ts-mockito';
import { HeroService, HEROES } from '../../services';
import { DashboardComponent } from './dashboard.component';
import { AppModule } from '../../../app/app.module';

describe('DashboardComponent', () => {
  let mockHeroService: HeroService;

  beforeEach(() => {
    mockHeroService = mock(HeroService);

    return MockBuilder(DashboardComponent, AppModule).mock(
      HeroService,
      instance(mockHeroService)
    );
  });

  function createComponent<T>(): DashboardComponent {
    const fixture = MockRender(DashboardComponent);
    return fixture.point.componentInstance;
  }

  it('should call "getHeroes" service method while creating', () => {
    when(mockHeroService.getHeroes()).thenReturn(of(HEROES));

    createComponent();
    verify(mockHeroService.getHeroes()).once();
  });
});
