import type { Config } from 'jest';

const jestConfig: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: ['**/src/**/*.spec.ts'],
  verbose: true,
  silent: true,
  bail: 1,
  ci: true,
  displayName: 'Tour of heroes:CI',
  moduleFileExtensions: ['js', 'ts'],
  collectCoverage: false,
  coverageDirectory: undefined,
  updateSnapshot: false,
  snapshotResolver: './snapshot.resolver.js',
  testTimeout: 3000,
  reporters: [
    ['github-actions', { silent: false }],
    'summary',
    [
      'jest-slow-test-reporter',
      { numTests: 5, warnOnSlowerThan: 500, color: true },
    ],
  ],
};

export default jestConfig;
