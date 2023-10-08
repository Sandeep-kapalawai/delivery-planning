const { defaults } = require('jest-config');

module.exports = {
    collectCoverageFrom: ['<rootDir>/src/**/*.{js,ts,vue}'],
    coverageReporters: ['clover', 'json', 'lcov', 'cobertura', 'text'],
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'vue'],
    moduleNameMapper: {
        '\\.(css|scss|jpg|jpeg|png|gif)$': '<rootDir>/jest/mocks/moduleMock.js',
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testEnvironment: 'jsdom',
    testResultsProcessor: 'jest-junit',
    transform: {
        '^.+\\.js$': 'babel-jest',
        '^.+\\.vue$': '@vue/vue2-jest',
        '^.+\\.ts$': 'ts-jest',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    watchPathIgnorePatterns: ['<rootDir>/node_modules/'],
    transformIgnorePatterns: ['node_modules/(?!(@maersk-global)|(@material)|(lit)|(@lit)|(lit-element)|(lit-html)|(vee-validate)|(dayjs))'],
    reporters: [
        'default',
        [
            'jest-sonar',
            {
                outputDirectory: 'test-reports',
                outputName: 'test-report.xml',
                reportedFilePath: 'relative',
                relativeRootDir: '<rootDir>/../',
            },
        ],
    ],
};
