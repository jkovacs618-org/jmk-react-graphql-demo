import React, { ReactNode, useContext, useState } from 'react';
import { AUTH_TOKEN } from '../setup';
import { AuthUser } from '../interfaces/AuthUser';

interface IAuthContext {
	authUser: AuthUser | null,
	setAuthUser: (user: AuthUser | null) => void,
	authToken: string | null,
	setAuthToken: (user: string | null) => void,
}

const AuthContext = React.createContext({
	authUser: null,
	setAuthUser: (user: AuthUser | null) => {
		user
	},
	authToken: null,
	setAuthToken: (token: string | null) => {
		token
	},
} as IAuthContext);

export function useAuth() {
	return useContext(AuthContext);
}

export const AuthProvider = ( {children, ...props}: {children?: ReactNode} ) => {
	const localUser = localStorage.getItem('user');
    const initUser = (localUser ? JSON.parse(localUser) : null);
	const [authUser, _setAuthUser] = useState<AuthUser | null>(initUser);

	const localToken = localStorage.getItem(AUTH_TOKEN);
	const [authToken, _setAuthToken] = useState(localToken);

	const setAuthUser = (user: AuthUser | null) => {
		if (user) {
			localStorage.setItem('user', JSON.stringify(user));
		} else {
			localStorage.removeItem('user');
		}
		_setAuthUser(user);
	};

	const setAuthToken = (token: string | null) => {
		if (token) {
			localStorage.setItem(AUTH_TOKEN, token);
		}
		else {
			localStorage.removeItem(AUTH_TOKEN);
		}
		_setAuthToken(token);
	}

    const value = {
        authUser,
        setAuthUser,
		authToken,
		setAuthToken
    }

	return (
		<AuthContext.Provider value={value} {...props}>
			{children}
		</AuthContext.Provider>
	);
};
