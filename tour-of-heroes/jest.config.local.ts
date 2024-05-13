import type { Config } from 'jest';

const jestConfig: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  verbose: false,
  bail: 1,
  ci: false,
  displayName: 'Tour of heroes:Local',
  moduleFileExtensions: ['js', 'ts'],
  collectCoverage: false,
  coverageDirectory: undefined,
  updateSnapshot: true,
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
