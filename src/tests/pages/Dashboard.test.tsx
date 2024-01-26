import { render, screen } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import Dashboard from '@/pages/Dashboard'
import '@/plugins/fontawesome'

test('renders dashboard page', () => {
    render(
        <Router>
            <Dashboard />
        </Router>
    )

    const tile1 = screen.getByText(/Family/i)
    expect(tile1).toBeInTheDocument()

    const tile2 = screen.getByText(/Events/i)
    expect(tile2).toBeInTheDocument()

    const tile3 = screen.getByText(/Accounts/i)
    expect(tile3).toBeInTheDocument()
})
