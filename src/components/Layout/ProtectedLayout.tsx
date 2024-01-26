import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from './Navigation/Navigation'

const ProtectedLayout: React.FC = () => {
    // const { authUser, setAuthUser } = useAuth();
    const { authUser } = useAuth()

    // If the user is not logged in, redirect to Root path for Login page.
    if (!authUser) {
        return <Navigate to="/" />
    }

    return (
        <div>
            <Navigation />

            <div className="px-8 py-6">
                <Outlet />
            </div>
        </div>
    )
}

export default ProtectedLayout
