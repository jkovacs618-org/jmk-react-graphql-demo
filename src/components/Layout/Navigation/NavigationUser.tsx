import React from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAuth } from '@/contexts/AuthContext'

const NavigationUser: React.FC = () => {
    const { authUser, setAuthUser, setAuthToken } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        setAuthToken(null)
        setAuthUser(null)
        navigate('/', { state: { message: 'logged_out' } })
    }

    return (
        <div>
            <NavLink to="/account" className="nav-link">
                <FontAwesomeIcon icon="circle-user" className="mr-2 text-lg" />
                {authUser ? (
                    <span>
                        {authUser.nameFirst} {authUser.nameLast}
                    </span>
                ) : null}
            </NavLink>

            <Link
                to="#"
                onClick={handleLogout}
                className="text-white hover:text-gray-300 cursor-pointer ml-6"
                title="Log Out"
            >
                <FontAwesomeIcon icon="right-from-bracket" className="text-lg" title="Log Out" />
            </Link>
        </div>
    )
}

export default NavigationUser
