// Note: Vite provides import.meta, but Jest cannot use it, so must mock src/contants.ts in setupTests.ts.
const {
    MODE: ENVIRONMENT,
    VITE_GRAPHQL_BASE_URL,
    VITE_DEFAULT_EMAIL,
    VITE_DEFAULT_PASS,
} = import.meta.env

export { ENVIRONMENT, VITE_GRAPHQL_BASE_URL, VITE_DEFAULT_EMAIL, VITE_DEFAULT_PASS }

export const AUTH_TOKEN = 'auth-token'
