// Ref: https://github.com/testing-library/jest-dom

import '@testing-library/jest-dom'

// See: src/constants.ts; Vite provides import.meta for env vars, but Jest does not, so must mock src/constants here.
jest.mock('src/constants', () => ({
    ENVIRONMENT: 'development',
    VITE_GRAPHQL_BASE_URL: 'http://localhost:4001/',
    VITE_DEFAULT_EMAIL: 'user@example.org',
    VITE_DEFAULT_PASS: 'password',
}))
