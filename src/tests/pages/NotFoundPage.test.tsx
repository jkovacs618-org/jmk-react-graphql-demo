import { render, screen } from '@testing-library/react'
// import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import NotFoundPage from '../../pages/NotFoundPage'

test('renders not found page', () => {
    render(
        <Router>
            <NotFoundPage />
        </Router>
    )
    const errorMessage = screen.getByText(/Page Not Found/i)
    expect(errorMessage).toBeInTheDocument()
})
