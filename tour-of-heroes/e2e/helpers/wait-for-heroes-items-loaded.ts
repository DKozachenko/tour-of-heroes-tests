import { HeroesPageObject } from '../page-objects';

export async function waitForHeroesItemsLoaded(
  heroesPageObject: HeroesPageObject
): Promise<void> {
  await heroesPageObject.heroItems.first().waitFor({
    state: 'visible',
    timeout: 5000,
  });
}
