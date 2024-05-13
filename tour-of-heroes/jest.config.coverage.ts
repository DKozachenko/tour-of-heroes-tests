import type { Config } from 'jest';

const jestConfig: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  verbose: true,
  bail: 1,
  ci: false,
  displayName: 'Tour of heroes:Coverage',
  moduleFileExtensions: ['js', 'ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  updateSnapshot: false,
  snapshotResolver: './snapshot.resolver.js',
  testTimeout: 3000,
  reporters: [
    'default',
    [
      'jest-slow-test-reporter',
      { numTests: 5, warnOnSlowerThan: 500, color: true },
    ],
  ],
};

export default jestConfig;
