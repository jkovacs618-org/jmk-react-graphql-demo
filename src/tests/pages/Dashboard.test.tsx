import { render, screen } from '@testing-library/react'
// import React from 'react'
import Dashboard from '../../pages/Dashboard'

test('renders dashoard page', () => {
    render(<Dashboard />)
    const greetings = screen.getByText(/Events/i)
    expect(greetings).toBeInTheDocument()
})
