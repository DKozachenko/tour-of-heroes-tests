import type { Config } from 'jest';
import { BASE_CONFIG } from './jest.config.base';

const jestConfig: Config = {
  ...BASE_CONFIG,
  displayName: 'Tour of heroes:Report',
  verbose: false,
  silent: true,
  ci: true,
  collectCoverage: false,
  coverageDirectory: undefined,
  updateSnapshot: false,
  reporters: [['jest-junit', { outputFile: './report/test-results.xml' }]],
};

export default jestConfig;
