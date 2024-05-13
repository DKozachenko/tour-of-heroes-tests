import type { Config } from 'jest';

const jestConfig: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  verbose: false,
  bail: 1,
  ci: true,
  displayName: 'Tour of heroes:Report',
  moduleFileExtensions: ['js', 'ts'],
  collectCoverage: false,
  coverageDirectory: undefined,
  updateSnapshot: false,
  snapshotResolver: './snapshot.resolver.js',
  testTimeout: 3000,
  reporters: [['jest-junit', { outputFile: './report/test-results.xml' }]],
};

export default jestConfig;
