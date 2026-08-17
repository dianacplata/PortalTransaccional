import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testRegex: '.*\\.spec\\.tsx?$',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss|svg)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          // CommonJS requerido — import.meta no está disponible en Jest
          module: 'commonjs',
          types: ['jest', '@testing-library/jest-dom', 'node'],
          baseUrl: '.',
          paths: { '@/*': ['src/*'] },
          strict: true,
        },
      },
    ],
  },
  coverageDirectory: '../coverage-frontend',
};

export default config;
