import { DashboardPageObject } from '../page-objects';

export async function waitForHeroesLinksLoaded(
  dashboardPageObject: DashboardPageObject
): Promise<void> {
  await dashboardPageObject.heroLinks.first().waitFor({
    state: 'visible',
    timeout: 5000,
  });
}
