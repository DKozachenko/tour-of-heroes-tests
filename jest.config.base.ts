import { Config } from 'jest';

export const BASE_CONFIG: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: ['**/src/**/*.spec.ts'],
  bail: 1,
  moduleFileExtensions: ['js', 'ts'],
  snapshotResolver: './snapshot.resolver.js',
  testTimeout: 3000,
};
