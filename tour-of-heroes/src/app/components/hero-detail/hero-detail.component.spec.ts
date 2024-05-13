import { DebugElement } from '@angular/core';
import { NgModel } from '@angular/forms';
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

class PageObject {
  private fixtureDebugElement: DebugElement;

  private getElementByAutomationId(id: string): DebugElement {
    return this.fixtureDebugElement.query(By.css(`[automation-id=${id}]`));
  }

  constructor(fixture: MockedComponentFixture<HeroDetailComponent>) {
    this.fixtureDebugElement = fixture.debugElement;
  }

  get heading(): DebugElement {
    return this.getElementByAutomationId('heading');
  }

  get heroId(): DebugElement {
    return this.getElementByAutomationId('hero-id');
  }

  get heroNameLabel(): DebugElement {
    return this.getElementByAutomationId('hero-name-label');
  }

  get heroNameInput(): DebugElement {
    return this.getElementByAutomationId('hero-name-input');
  }

  get backButton(): DebugElement {
    return this.getElementByAutomationId('back-button');
  }

  get saveButton(): DebugElement {
    return this.getElementByAutomationId('save-button');
  }
}

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

  describe('Functional', () => {
    describe('getHero', () => {
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

    describe('updateHero', () => {
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
        expect(spyOnGoBack).toHaveBeenCalled();
      });
    });
  });

  describe('Layout', () => {
    it('should not contain html if "hero" property is not set', () => {
      mockCalls();
      const fixture = createFixture();
      const component = fixture.point.componentInstance;
      component.hero = undefined;

      const fixtureDebugElement = fixture.debugElement;
      expect(fixtureDebugElement.nativeElement.innerHtml).toBeUndefined();
      expect(fixtureDebugElement.nativeElement).toMatchSnapshot();
    });

    it('should contain hero description and action buttons if "hero" property is set', () => {
      mockCalls();
      const fixture = createFixture();
      const component = fixture.point.componentInstance;
      const mockHero = HEROES[0];
      component.hero = mockHero;

      const pageObject = new PageObject(fixture);
      expect(pageObject.heading.nativeElement.textContent).toBe(
        `${mockHero.name.toUpperCase()} Details`
      );
      expect(pageObject.heading.nativeElement).toMatchSnapshot();
      expect(pageObject.heroId.nativeElement.textContent).toBe(
        `id: ${mockHero.id}`
      );
      expect(pageObject.heroId.nativeElement).toMatchSnapshot();
      expect(pageObject.heroNameLabel.nativeElement.textContent).toBe(
        'Hero name: '
      );
      expect(pageObject.heroNameLabel.nativeElement).toMatchSnapshot();
      expect(pageObject.heroNameInput.injector.get(NgModel).model).toBe(
        mockHero.name
      );
      expect(pageObject.heroNameInput.nativeElement).toMatchSnapshot();
      expect(pageObject.backButton).not.toBeNull();
      expect(pageObject.backButton.nativeElement).toMatchSnapshot();
      expect(pageObject.saveButton).not.toBeNull();
      expect(pageObject.saveButton.nativeElement).toMatchSnapshot();
    });

    it('should call "goBack" component method if go back button has clicked', () => {
      mockCalls();
      const fixture = createFixture();
      const component = fixture.point.componentInstance;

      const pageObject = new PageObject(fixture);
      const spyOnGoBack = jest.spyOn(component, 'goBack');
      pageObject.backButton.triggerEventHandler('click');
      expect(spyOnGoBack).toHaveBeenCalled();
    });

    it('should call "save" component method if save button has clicked', () => {
      const mockId = anyNumber();
      const mockHero = HEROES[0];
      when(mockRoute.snapshot).thenReturn({
        paramMap: new Map([['id', mockId.toString()]]),
      } as any);
      when(mockHeroService.getHero(mockId)).thenReturn(of(mockHero));
      when(mockHeroService.updateHero(anything())).thenReturn(of(anything()));

      const fixture = createFixture();
      const component = fixture.point.componentInstance;

      const pageObject = new PageObject(fixture);
      const spyOnSave = jest.spyOn(component, 'save');
      pageObject.saveButton.triggerEventHandler('click');
      expect(spyOnSave).toHaveBeenCalled();
    });
  });
});
