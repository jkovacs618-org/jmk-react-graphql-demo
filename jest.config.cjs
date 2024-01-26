/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    moduleNameMapper: {
        // import path aliases:
        '@/(.*)$': '<rootDir>/src/$1',

        // mocking assets and styling
        '^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/tests/mocks/fileMock.ts',
        '^.+\\.(css|less|scss|sass)$': '<rootDir>/tests/mocks/styleMock.ts',

        /* mock models and services folder */
        '(assets|models|services)': '<rootDir>/tests/mocks/fileMock.ts',
    },

    setupFilesAfterEnv: ['./src/tests/setupTests.ts'],

    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    modulePaths: ['<rootDir>'],
    testEnvironment: 'jsdom',
}
