import { Router, RouterLink, RouterModule } from '@angular/router';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Location } from '@angular/common';
import {
  MockBuilder,
  MockRender,
  MockedComponentFixture,
  NG_MOCKS_ROOT_PROVIDERS,
} from 'ng-mocks';
import { mock, instance, when, verify, anything, deepEqual } from 'ts-mockito';
import { of } from 'rxjs';
import { HEROES, HeroService } from '../../services';
import { Hero } from '../../models';
import { HeroesComponent } from './heroes.component';
import { AppModule } from '../../app.module';

class PageObject {
  private fixtureDebugElement: DebugElement;

  private getElementByAutomationId(id: string): DebugElement {
    return this.fixtureDebugElement.query(By.css(`[automation-id=${id}]`));
  }

  private getElementsByAutomationId(id: string): DebugElement[] {
    return this.fixtureDebugElement.queryAll(By.css(`[automation-id=${id}]`));
  }

  constructor(fixture: MockedComponentFixture<HeroesComponent>) {
    this.fixtureDebugElement = fixture.debugElement;
  }

  get heading(): DebugElement {
    return this.getElementByAutomationId('heading');
  }

  get createDiv(): DebugElement {
    return this.getElementByAutomationId('create-div');
  }

  get label(): DebugElement {
    return this.getElementByAutomationId('create-label');
  }

  get input(): DebugElement {
    return this.getElementByAutomationId('create-input');
  }

  get addButton(): DebugElement {
    return this.getElementByAutomationId('add-button');
  }

  get heroList(): DebugElement {
    return this.getElementByAutomationId('heroes');
  }

  get heroItems(): DebugElement[] {
    return this.getElementsByAutomationId('hero-item');
  }

  get heroItemsLinks(): DebugElement[] {
    return this.getElementsByAutomationId('hero-link');
  }

  get heroItemsButtons(): DebugElement[] {
    return this.getElementsByAutomationId('hero-button');
  }
}

describe('HeroesComponent', () => {
  let mockHeroService: HeroService;

  beforeEach(() => {
    mockHeroService = mock(HeroService);

    return MockBuilder(HeroesComponent, AppModule).mock(
      HeroService,
      instance(mockHeroService)
    );
  });

  function createFixture(): MockedComponentFixture<HeroesComponent> {
    return MockRender(HeroesComponent);
  }

  function createComponent(): HeroesComponent {
    return createFixture().point.componentInstance;
  }

  function mockCalls(): void {
    // It is necessary to make a copy of the array so that tests cannot influence each other by changing the array
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

    describe('addHero', () => {
      it('should not call "addHero" service method via "add" component method if name is empty string (or contains only spaces)', () => {
        mockCalls();
        const component = createComponent();

        component.add('');
        component.add('      ');
        verify(mockHeroService.addHero(anything())).never();
      });

      it('should call "addHero" service method via "add" component method and push new hero in "heroes" property', () => {
        const oldHeroes = [HEROES[0], HEROES[1]];
        const newHeroName = ' test name ';
        const mockNewHero: Hero = {
          id: oldHeroes[oldHeroes.length - 1].id + 1,
          name: newHeroName.trim(),
        };

        when(mockHeroService.getHeroes()).thenReturn(of([...oldHeroes]));
        when(
          mockHeroService.addHero(deepEqual({ name: mockNewHero.name } as Hero))
        ).thenReturn(of(mockNewHero));

        const component = createComponent();
        component.add(newHeroName);
        verify(
          mockHeroService.addHero(deepEqual({ name: mockNewHero.name }) as Hero)
        ).once();
        expect(component.heroes).toHaveLength(oldHeroes.length + 1);
        expect(component.heroes).toStrictEqual(oldHeroes.concat([mockNewHero]));
      });
    });

    describe('heroes', () => {
      it('should not change "heroes" property if non-existent hero was tried to deleted', () => {
        const oldHeroes = [HEROES[0], HEROES[1]];
        const nonExistentHero = {
          id: 1000,
          name: 'non-existent',
        };
        when(mockHeroService.getHeroes()).thenReturn(of(oldHeroes));
        when(mockHeroService.deleteHero(nonExistentHero.id)).thenReturn(
          of(undefined as any)
        );

        const component = createComponent();
        component.delete(nonExistentHero);
        verify(mockHeroService.deleteHero(nonExistentHero.id)).once();
        expect(component.heroes).toHaveLength(oldHeroes.length);
        expect(component.heroes).toStrictEqual(oldHeroes);
      });

      it('should change "heroes" property if existed hero was tried to deleted', () => {
        const oldHeroes = [HEROES[0], HEROES[1]];
        const nonExistentHero = oldHeroes[0];
        when(mockHeroService.getHeroes()).thenReturn(of(oldHeroes));
        when(mockHeroService.deleteHero(nonExistentHero.id)).thenReturn(
          of(undefined as any)
        );

        const component = createComponent();
        component.delete(nonExistentHero);
        verify(mockHeroService.deleteHero(nonExistentHero.id)).once();
        expect(component.heroes).toHaveLength(oldHeroes.length - 1);
        expect(component.heroes).toStrictEqual(
          oldHeroes.filter((hero) => hero.id !== nonExistentHero.id)
        );
      });
    });
  });

  describe('Layout', () => {
    it('should contain heading', () => {
      mockCalls();

      const fixture = createFixture();
      const pageObject = new PageObject(fixture);
      expect(pageObject.heading).not.toBeNull();
      expect(pageObject.heading.nativeElement).toMatchSnapshot();
    });

    it('should contain block for creating new hero with input and add button', () => {
      mockCalls();

      const fixture = createFixture();
      const pageObject = new PageObject(fixture);
      expect(pageObject.label).not.toBeNull();
      expect(pageObject.label.nativeElement).toMatchSnapshot();
      expect(pageObject.label.nativeElement.textContent).toBe('Hero name: ');
      expect(pageObject.input).not.toBeNull();
      expect(pageObject.input.nativeElement).toMatchSnapshot();
      expect(pageObject.addButton).not.toBeNull();
      expect(pageObject.addButton.nativeElement).toMatchSnapshot();
      expect(pageObject.addButton.nativeElement.textContent).toContain(
        'Add hero'
      );
    });

    it('should call "add" component method and clear input if add button has clicked', () => {
      mockCalls();
      when(mockHeroService.addHero(anything())).thenReturn(of(anything()));

      const fixture = createFixture();
      const component = fixture.point.componentInstance;
      const spyOnAdd = jest.spyOn(component, 'add');

      const pageObject = new PageObject(fixture);
      const mockNewHeroName = 'test name';
      pageObject.input.nativeElement.value = mockNewHeroName;
      pageObject.addButton.triggerEventHandler('click');
      expect(spyOnAdd).toHaveBeenCalledWith(mockNewHeroName);
      expect(pageObject.input.nativeElement.value).toBe('');
    });

    it('should call "delete" component method if remove item button has clicked', () => {
      const mockHeroes = [HEROES[0], HEROES[1], HEROES[2]];
      const heroIndexForRemove = 1;
      const heroForRemove = mockHeroes[heroIndexForRemove];
      when(mockHeroService.getHeroes()).thenReturn(of(mockHeroes));
      when(mockHeroService.deleteHero(heroForRemove.id)).thenReturn(
        of(undefined as any)
      );

      const fixture = createFixture();
      const component = fixture.point.componentInstance;
      const spyOnAdd = jest.spyOn(component, 'delete');

      const pageObject = new PageObject(fixture);
      pageObject.heroItemsButtons[heroIndexForRemove].triggerEventHandler(
        'click'
      );
      expect(spyOnAdd).toHaveBeenCalledWith(heroForRemove);
    });

    describe('hero list', () => {
      it('should contain hero list with link and button for deleting', () => {
        const mockHeroes = [HEROES[0], HEROES[1]];
        when(mockHeroService.getHeroes()).thenReturn(of(mockHeroes));

        const fixture = createFixture();
        const pageObject = new PageObject(fixture);
        expect(pageObject.heroList).not.toBeNull();
        expect(pageObject.heroList.nativeElement).toMatchSnapshot();
        expect(pageObject.heroItems).toHaveLength(mockHeroes.length);
        for (let i = 0; i < pageObject.heroItems.length; ++i) {
          const hero = mockHeroes[i];
          const heroItemLink = pageObject.heroItemsLinks[i];
          const heroItemButton = pageObject.heroItemsButtons[i];
          expect(heroItemLink.nativeElement.textContent).toContain(
            `${hero.id} ${hero.name}`
          );
          expect(heroItemLink.nativeElement).toMatchSnapshot();
          expect(heroItemLink.injector.get(RouterLink).routerLink).toBe(
            `/detail/${hero.id}`
          );
          expect(heroItemButton.nativeElement.textContent).toContain('x');
          expect(heroItemButton.nativeElement).toMatchSnapshot();
        }
      });

      it('should add new item to hero list if add button has clicked', () => {
        const oldHeroes = [HEROES[0], HEROES[1]];
        const mockNewHero: Hero = {
          id: oldHeroes[oldHeroes.length - 1].id + 1,
          name: 'new hero name',
        };

        when(mockHeroService.getHeroes()).thenReturn(of([...oldHeroes]));
        when(
          mockHeroService.addHero(deepEqual({ name: mockNewHero.name } as Hero))
        ).thenReturn(of(mockNewHero));

        const fixture = createFixture();
        const pageObject = new PageObject(fixture);
        expect(pageObject.heroList).not.toBeNull();
        expect(pageObject.heroItems).toHaveLength(oldHeroes.length);
        for (let i = 0; i < pageObject.heroItems.length; ++i) {
          const hero = oldHeroes[i];
          const heroItemLink = pageObject.heroItemsLinks[i];
          const heroItemButton = pageObject.heroItemsButtons[i];
          expect(heroItemLink.nativeElement.textContent).toContain(
            `${hero.id} ${hero.name}`
          );
          expect(heroItemLink.injector.get(RouterLink).routerLink).toBe(
            `/detail/${hero.id}`
          );
          expect(heroItemButton.nativeElement.textContent).toContain('x');
        }

        pageObject.input.nativeElement.value = mockNewHero.name;
        pageObject.addButton.triggerEventHandler('click');
        fixture.detectChanges();
        const newHeroes = oldHeroes.concat([mockNewHero]);
        expect(pageObject.heroItems).toHaveLength(newHeroes.length);
        for (let i = 0; i < pageObject.heroItems.length; ++i) {
          const hero = newHeroes[i];
          const heroItemLink = pageObject.heroItemsLinks[i];
          const heroItemButton = pageObject.heroItemsButtons[i];
          expect(heroItemLink.nativeElement.textContent).toContain(
            `${hero.id} ${hero.name}`
          );
          expect(heroItemLink.injector.get(RouterLink).routerLink).toBe(
            `/detail/${hero.id}`
          );
          expect(heroItemButton.nativeElement.textContent).toContain('x');
        }
      });

      it('should remove item from hero list if remove item button has clicked', () => {
        const oldHeroes = [HEROES[0], HEROES[1], HEROES[2]];
        const heroIndexForRemove = 1;
        const heroForRemove = oldHeroes[heroIndexForRemove];
        when(mockHeroService.getHeroes()).thenReturn(of(oldHeroes));
        when(mockHeroService.deleteHero(heroForRemove.id)).thenReturn(
          of(undefined as any)
        );

        const fixture = createFixture();
        const pageObject = new PageObject(fixture);
        expect(pageObject.heroList).not.toBeNull();
        expect(pageObject.heroItems).toHaveLength(oldHeroes.length);
        for (let i = 0; i < pageObject.heroItems.length; ++i) {
          const hero = oldHeroes[i];
          const heroItemLink = pageObject.heroItemsLinks[i];
          const heroItemButton = pageObject.heroItemsButtons[i];
          expect(heroItemLink.nativeElement.textContent).toContain(
            `${hero.id} ${hero.name}`
          );
          expect(heroItemLink.injector.get(RouterLink).routerLink).toBe(
            `/detail/${hero.id}`
          );
          expect(heroItemButton.nativeElement.textContent).toContain('x');
        }

        pageObject.heroItemsButtons[heroIndexForRemove].triggerEventHandler(
          'click'
        );
        fixture.detectChanges();
        const newHeroes = oldHeroes.filter(
          (hero) => hero.id !== heroForRemove.id
        );
        expect(pageObject.heroItems).toHaveLength(newHeroes.length);
        for (let i = 0; i < pageObject.heroItems.length; ++i) {
          const hero = newHeroes[i];
          const heroItemLink = pageObject.heroItemsLinks[i];
          const heroItemButton = pageObject.heroItemsButtons[i];
          expect(heroItemLink.nativeElement.textContent).toContain(
            `${hero.id} ${hero.name}`
          );
          expect(heroItemLink.injector.get(RouterLink).routerLink).toBe(
            `/detail/${hero.id}`
          );
          expect(heroItemButton.nativeElement.textContent).toContain('x');
        }
      });
    });
  });
});

describe('HeroesComponent:Routing', () => {
  let mockHeroService: HeroService;

  beforeEach(() => {
    mockHeroService = mock(HeroService);

    return MockBuilder(
      [
        HeroesComponent,
        RouterModule,
        RouterTestingModule.withRoutes([]),
        NG_MOCKS_ROOT_PROVIDERS,
      ],
      AppModule
    ).mock(HeroService, instance(mockHeroService));
  });

  function createFixture(): MockedComponentFixture<HeroesComponent> {
    return MockRender(HeroesComponent);
  }

  function mockCalls(): void {
    when(mockHeroService.getHeroes()).thenReturn(
      of(HEROES.slice(0, HEROES.length))
    );
  }

  it('should change location if appropriate hero item has clicked', fakeAsync(() => {
    mockCalls();

    const fixture = createFixture();
    const router = fixture.point.injector.get(Router);
    const location = fixture.point.injector.get(Location);

    if (fixture.ngZone) {
      fixture.ngZone.run(() => router.initialNavigation());
      tick();
    }

    const pageObject = new PageObject(fixture);
    for (let i = 0; i < pageObject.heroItemsLinks.length; ++i) {
      const heroLink = pageObject.heroItemsLinks[i];
      if (fixture.ngZone) {
        fixture.ngZone.run(() => {
          heroLink.triggerEventHandler('click', {
            button: 0,
          });
          tick();
        });
      }

      expect(location.path()).toBe(heroLink.injector.get(RouterLink).href);
    }
  }));
});
