import type { Config } from 'jest';

const jestConfig: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  verbose: false,
  bail: 1,
  ci: false,
  displayName: 'Tour of heroes:Local',
  moduleFileExtensions: ['js', 'ts'],
  collectCoverage: false,
};

export default jestConfig;
