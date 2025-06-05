import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
});

/** @type {import('jest').Config} */
const config = {
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    transform: {
        'node_modules/@t3-oss/.+\\.js$': ['ts-jest', {}],
    },
    transformIgnorePatterns: ['/node_modules/(?!@t3-oss)'],
    setupFilesAfterEnv: ['<rootDir>/src/test/test-setup.ts'],
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    }
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
