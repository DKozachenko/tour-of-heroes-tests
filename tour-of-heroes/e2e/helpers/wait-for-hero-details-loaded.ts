import { DetailsPageObject } from '../page-objects';

export async function waitForHeroDetailsLoaded(
  detailsPageObject: DetailsPageObject
): Promise<void> {
  await detailsPageObject.wrapper.waitFor({
    state: 'visible',
    timeout: 5000,
  });
}
