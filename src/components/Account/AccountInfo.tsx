import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
// import dayjs from 'dayjs'

const AccountInfo: React.FC = () => {
    const { authUser } = useAuth()

    return authUser ? (
        <div className="block p-8 bg-white border border-gray-200 shadow-xl rounded-lg shadowdark:border-gray-700">
            <h5 className="mb-4 text-2xl font-bold tracking-tight">
                {authUser.nameFirst} {authUser.nameLast}
            </h5>
            <p className="font-normal text-gray-700">Email: {authUser.email}</p>
            <p className="font-normal text-gray-700">
                {/* Created: {dayjs(authUser.createdAt).format("M/DD/YYYY")} */}
            </p>
        </div>
    ) : (
        ''
    )
}

export default AccountInfo
