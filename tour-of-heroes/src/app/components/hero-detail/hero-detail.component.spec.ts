import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MockBuilder, MockRender, MockedComponentFixture } from 'ng-mocks';
import { of } from 'rxjs';
import { mock, instance, when, verify, anyNumber, anything } from 'ts-mockito';
import { HeroService, HEROES } from '../../services';
import { Hero } from '../../models';
import { HeroDetailComponent } from './hero-detail.component';
import { AppModule } from '../../../app/app.module';

describe('HeroDetailComponent', () => {
  let mockHeroService: HeroService;
  let mockLocation: Location;
  let mockRoute: ActivatedRoute;

  beforeEach(() => {
    mockHeroService = mock(HeroService);
    mockLocation = mock(Location);
    mockRoute = mock(ActivatedRoute);

    return MockBuilder(HeroDetailComponent, AppModule)
      .mock(HeroService, instance(mockHeroService))
      .mock(Location, instance(mockLocation))
      .mock(ActivatedRoute, instance(mockRoute));
  });

  function createFixture(): MockedComponentFixture<HeroDetailComponent> {
    return MockRender(HeroDetailComponent);
  }

  function createComponent(): HeroDetailComponent {
    return createFixture().point.componentInstance;
  }

  function mockCalls(): void {
    const mockId = anyNumber();
    const mockHero = HEROES[0];

    when(mockRoute.snapshot).thenReturn({
      paramMap: new Map([['id', mockId.toString()]]),
    } as any);
    when(mockHeroService.getHero(mockId)).thenReturn(of(mockHero));
  }

  // Functional tests
  it('should call "getHero" service method while creating', () => {
    const mockId = anyNumber();
    const mockHero = HEROES[0];

    when(mockRoute.snapshot).thenReturn({
      paramMap: new Map([['id', mockId.toString()]]),
    } as any);
    when(mockHeroService.getHero(mockId)).thenReturn(of(mockHero));

    createComponent();
    verify(mockHeroService.getHero(mockId)).once();
  });

  it('should call "getHero" service method via "getHeroes" component method', () => {
    const mockId = anyNumber();
    const mockHero = HEROES[0];

    when(mockRoute.snapshot).thenReturn({
      paramMap: new Map([['id', mockId.toString()]]),
    } as any);
    when(mockHeroService.getHero(mockId)).thenReturn(of(mockHero));

    const component = createComponent();
    component.getHero();
    verify(mockHeroService.getHero(mockId)).twice();
  });

  it('should set "hero" property as existed hero if id exists', () => {
    const existedId = 12;
    const existedHero = <Hero>HEROES.find((hero) => hero.id === existedId);

    when(mockRoute.snapshot).thenReturn({
      paramMap: new Map([['id', existedId.toString()]]),
    } as any);
    when(mockHeroService.getHero(existedId)).thenReturn(of(existedHero));

    const component = createComponent();
    verify(mockHeroService.getHero(existedId)).once();
    expect(component.hero).toEqual(existedHero);
  });

  it('should call "back" Location method via "goBack" component method', () => {
    mockCalls();

    const component = createComponent();
    component.goBack();
    verify(mockLocation.back()).once();
  });

  it('should not call "updateHero" service method via "save" component method if "hero" property is not set', () => {
    mockCalls();
    const component = createComponent();
    component.hero = undefined;
    component.save();
    verify(mockHeroService.updateHero(anything())).never();
  });

  it('should call "updateHero" service method and "goBack" component method via "save" component method if "hero" property is set', () => {
    mockCalls();
    const mockHero = HEROES[0];
    when(mockHeroService.updateHero(mockHero)).thenReturn(of(undefined));

    const component = createComponent();
    component.hero = mockHero;
    const spyOnGoBack = jest.spyOn(component, 'goBack');
    component.save();
    verify(mockHeroService.updateHero(mockHero)).once();
    expect(spyOnGoBack).toHaveBeenCalledTimes(1);
  });

  // Layout tests
  it('should not contain html if "hero" property is not set', () => {
    mockCalls();
    const fixture = createFixture();
    const component = fixture.point.componentInstance;
    component.hero = undefined;

    const fixtureDebugElement = fixture.debugElement;
    expect(fixtureDebugElement.nativeElement.innerHtml).not.toBeDefined();
  });

  it('should contain hero description and action buttons if "hero" property is set', () => {
    mockCalls();
    const fixture = createFixture();
    const component = fixture.point.componentInstance;
    const mockHero = HEROES[0];
    component.hero = mockHero;

    const fixtureDebugElement = fixture.debugElement;
    const headingDebugElement = fixtureDebugElement.query(By.css('h2'));
    const heroIdDebugElement = fixtureDebugElement.query(By.css('h2 + div'));
    const heroNameLabelDebugElement = fixtureDebugElement.query(
      By.css('div > label')
    );
    const heroNameInputDebugElement = fixtureDebugElement.query(
      By.css('div > input')
    );
    const [backButtonDebugElement, saveButtonDebugElement] =
      fixtureDebugElement.queryAll(By.css('button'));

    expect(headingDebugElement.nativeElement.textContent).toBe(
      `${mockHero.name.toUpperCase()} Details`
    );
    expect(heroIdDebugElement.nativeElement.textContent).toBe(
      `id: ${mockHero.id}`
    );
    expect(heroNameLabelDebugElement.nativeElement.textContent).toBe(
      'Hero name: '
    );
    expect(heroNameInputDebugElement.attributes['ng-reflect-model']).toBe(
      mockHero.name
    );
    expect(backButtonDebugElement).not.toBeNull();
    expect(saveButtonDebugElement).not.toBeNull();
  });

  it('should call "goBack" component method if go back button has clicked', () => {
    mockCalls();
    const fixture = createFixture();
    const component = fixture.point.componentInstance;

    const fixtureDebugElement = fixture.debugElement;
    const [backButtonDebugElement] = fixtureDebugElement.queryAll(
      By.css('button')
    );
    const spyOnGoBack = jest.spyOn(component, 'goBack');
    backButtonDebugElement.nativeElement.click();
    expect(spyOnGoBack).toHaveBeenCalledTimes(1);
  });

  it('should call "save" component method if save button has clicked', () => {
    mockCalls();
    const fixture = createFixture();
    const component = fixture.point.componentInstance;

    const fixtureDebugElement = fixture.debugElement;
    const [_, saveButtonDebugElement] = fixtureDebugElement.queryAll(
      By.css('button')
    );
    const spyOnSave = jest.spyOn(component, 'save');
    saveButtonDebugElement.nativeElement.click();
    expect(spyOnSave).toHaveBeenCalledTimes(1);
  });
});
