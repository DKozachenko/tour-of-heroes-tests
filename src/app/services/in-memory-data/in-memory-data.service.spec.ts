import { MockBuilder, MockRender } from 'ng-mocks';
import { HEROES, InMemoryDataService } from './in-memory-data.service';

describe('InMemoryDataService', () => {
  beforeEach(() => MockBuilder(InMemoryDataService));

  function createService(): InMemoryDataService {
    return MockRender(InMemoryDataService).point.componentInstance;
  }

  describe('createDb', () => {
    it('should return database object via "createDb" method', () => {
      const service = createService();
      expect(service.createDb()).toEqual({
        heroes: HEROES,
      });
    });
  });

  describe('genId', () => {
    it('should generate next id via "genId" method if "heroes" argument length more than 0', () => {
      const mockHeroes = HEROES.slice(0, 5);
      const service = createService();
      const nextId = Math.max(...mockHeroes.map((hero) => hero.id)) + 1;
      expect(service.genId(mockHeroes)).toBe(nextId);
    });

    it('should initial id via "genId" method if "heroes" argument length is 0', () => {
      const service = createService();
      expect(service.genId([])).toBe(11);
    });
  });
});
