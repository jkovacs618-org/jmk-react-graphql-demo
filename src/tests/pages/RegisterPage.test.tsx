import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter as Router } from 'react-router-dom'
import { MockedProvider } from '@apollo/client/testing'
import { AuthProvider } from '@/contexts/AuthContext'
import { SIGNUP_MUTATION, RegisterPage } from '@/pages/RegisterPage'

// Apollo React Testing with Mock data:
// Ref: https://www.apollographql.com/docs/react/development-testing/testing/
const mocks = [
    {
        request: {
            query: SIGNUP_MUTATION,
            variables: {
                nameFirst: 'Test',
                nameLast: 'Name',
                email: 'test@example.org',
                password: 'password',
            },
        },
        result: {
            data: {
                // NOTE: Mock 'data' object value must have the same shape as GraphQL 'signup' mutation response:
                // - "signup: { token: string, user: {...}, personExternalId: string}"
                signup: {
                    token: 'TEST_AUTH_TOKEN',
                    user: {
                        id: 10,
                        externalId: 'User10',
                        nameFirst: 'Test',
                        nameLast: 'Name',
                        email: 'test@example.org',
                        status: 'Active',
                        createdAt: new Date(),
                        person: {
                            externalId: 'Person10',
                        },
                    },
                    personExternalId: 'Person10',
                },
            },
        },
    },
]

test('renders register page', async () => {
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <AuthProvider>
                <Router>
                    <RegisterPage />
                </Router>
            </AuthProvider>
        </MockedProvider>
    )

    const formTitle = screen.getByText(/Create an account/i)
    expect(formTitle).toBeInTheDocument()

    // TO-DO: Fill the form fields to avoid validation error.
    fireEvent.change(screen.getByLabelText(/First Name/i), {
        target: { value: 'Test' },
    })
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
        target: { value: 'Name' },
    })
    fireEvent.change(screen.getByLabelText(/Your email/i), {
        target: { value: 'test@example.org' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'password' },
    })
    fireEvent.change(screen.getByLabelText('Confirm password'), {
        target: { value: 'password' },
    })

    // Test GraphQL Mutations:
    // https://www.apollographql.com/docs/react/development-testing/testing/#testing-mutations

    // Find the button element:
    const button = await screen.findByText('SIGN UP')
    // Simulate a click and fire the mutation:
    userEvent.click(button)

    // Check for the output for Mutation 'loading' and loaded states when 'data' is set.
    expect(await screen.findByText('LOADING...')).toBeInTheDocument()

    expect(await screen.findByText('SUCCESS!')).toBeInTheDocument()
})
