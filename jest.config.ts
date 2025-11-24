import { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageReporters: ['json-summary', 'text', 'lcov'],
  testTimeout: 60000,
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^src/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: ['<rootDir>/**/*.(spec|test).ts'],
  transformIgnorePatterns: ['<rootDir>/../node_modules/(?!@octokit)'],
};

export default config;
