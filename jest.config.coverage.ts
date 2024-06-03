import type { Config } from 'jest';
import { BASE_CONFIG } from './jest.config.base';

const jestConfig: Config = {
  ...BASE_CONFIG,
  displayName: 'Tour of heroes:Coverage',
  verbose: true,
  silent: true,
  ci: false,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  updateSnapshot: false,
  reporters: [
    'default',
    [
      'jest-slow-test-reporter',
      { numTests: 5, warnOnSlowerThan: 500, color: true },
    ],
  ],
};

export default jestConfig;
