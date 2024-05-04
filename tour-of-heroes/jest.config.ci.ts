import type { Config } from 'jest';

const jestConfig: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  verbose: true,
  bail: 1,
  ci: true,
  displayName: 'Tour of heroes:CI',
  moduleFileExtensions: ['js', 'ts'],
  collectCoverage: false,
};

export default jestConfig;
