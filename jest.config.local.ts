import type { Config } from 'jest';
import { BASE_CONFIG } from './jest.config.base';

const jestConfig: Config = {
  ...BASE_CONFIG,
  displayName: 'Tour of heroes:Local',
  verbose: false,
  silent: false,
  ci: false,
  collectCoverage: false,
  coverageDirectory: undefined,
  updateSnapshot: true,
  reporters: [
    'default',
    [
      'jest-slow-test-reporter',
      { numTests: 5, warnOnSlowerThan: 500, color: true },
    ],
  ],
};

export default jestConfig;
