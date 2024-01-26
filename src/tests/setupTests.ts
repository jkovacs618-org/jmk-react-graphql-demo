// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom

// Broken after V6:
// import '@testing-library/jest-dom/extend-expect'

import '@testing-library/jest-dom'

// See: src/contants.ts; Vite provides import.meta, but Jest does not, so must mock src/constants here.
jest.mock('src/constants', () => ({
    ENVIRONMENT: 'development',
    VITE_GRAPHQL_BASE_URL: 'http://localhost:4001/',
    VITE_DEFAULT_EMAIL: 'user@example.org',
    VITE_DEFAULT_PASS: 'password',
}))
