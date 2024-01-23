import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const GuestLayout: React.FC = () => {
    const { authUser } = useAuth();

	// if user is logged in, redirect to Dashboard page
	if (authUser) {
		return <Navigate to='/dashboard' />;
	}
	else {
		return (
			<>
				<Outlet />
			</>
		)
	}
}

export default GuestLayout