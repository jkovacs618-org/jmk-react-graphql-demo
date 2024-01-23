import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate()
    const redirectToHomePage = () => {
        navigate('/')
    }

    return (
        <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <div className="mt-6">
                <h1 className="text-3xl font-bold">Page Not Found</h1>
            </div>

            <div className="mt-6">
                <a className="cursor-pointer" onClick={() => redirectToHomePage()}>
                    Return to Homepage
                </a>
            </div>
        </div>
    )
}

export default NotFoundPage
