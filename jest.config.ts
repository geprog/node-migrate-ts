import { Config } from '@jest/types';
import { pathsToModuleNameMapper } from 'ts-jest/utils';

import { compilerOptions } from './tsconfig.json';

const moduleNameMapper = {
  ...pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/' + compilerOptions.baseUrl + '/',
  }),
} as Config.InitialOptions['moduleNameMapper'];

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  roots: ['<rootDir>/test'],
  moduleNameMapper,
  testEnvironment: 'jest-environment-jsdom',
  reporters: ['default', 'jest-junit'],
  collectCoverage: true,
  coverageReporters: ['json', 'text', 'cobertura'],
};

export default config;
