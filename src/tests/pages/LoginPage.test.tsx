import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter as Router } from 'react-router-dom'
import { MockedProvider } from '@apollo/client/testing'
import { AuthProvider } from '@/contexts/AuthContext'
import { VITE_DEFAULT_EMAIL, VITE_DEFAULT_PASS } from '@/constants'
import { LOGIN_MUTATION, LoginPage } from '@/pages/LoginPage'

// Apollo React Testing with Mock data:
// Ref: https://www.apollographql.com/docs/react/development-testing/testing/
const mocks = [
    {
        request: {
            query: LOGIN_MUTATION,
            variables: {
                email: VITE_DEFAULT_EMAIL,
                password: VITE_DEFAULT_PASS,
            },
        },
        result: {
            data: {
                // NOTE: Mock 'data' object value must have the same shape as GraphQL 'login' mutation response:
                // - "login: { token: string, user: {...}, personExternalId: string}"
                login: {
                    token: 'TEST_AUTH_TOKEN',
                    user: {
                        id: 1,
                        externalId: 'User1',
                        nameFirst: 'Demo',
                        nameLast: 'Name',
                        email: VITE_DEFAULT_EMAIL,
                        status: 'Active',
                        createdAt: new Date(),
                        person: {
                            externalId: 'Person1',
                        },
                    },
                    personExternalId: 'Person1',
                },
            },
        },
    },
]

test('renders login page', async () => {
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <AuthProvider>
                <Router>
                    <LoginPage />
                </Router>
            </AuthProvider>
        </MockedProvider>
    )

    const formTitle = screen.getByText(/Sign in to your account/i)
    expect(formTitle).toBeInTheDocument()

    // Test GraphQL Mutations:
    // https://www.apollographql.com/docs/react/development-testing/testing/#testing-mutations

    // Find the button element:
    const button = await screen.findByText('SIGN IN')
    // Simulate a click and fire the mutation:
    userEvent.click(button)

    // Check for the output for Mutation 'loading' and loaded states when 'data' is set.
    expect(await screen.findByText('LOADING...')).toBeInTheDocument()
    expect(await screen.findByText('LOGGED IN')).toBeInTheDocument()
})
