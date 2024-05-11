import type { Config } from 'jest';

const jestConfig: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  verbose: true,
  bail: 1,
  ci: true,
  displayName: 'Tour of heroes:Coverage',
  moduleFileExtensions: ['js', 'ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  reporters: [
    'default',
    ['jest-junit', { outputFile: './report/test-results.xml' }],
  ],
};

export default jestConfig;