import React from 'react'
import AccountInfo from '../components/Account/AccountInfo';

const AccountPage: React.FC = () => {
    return (
        <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'left', alignItems: 'left', flexDirection: 'column' }}>
            <div className="mb-4">
                <h2 className="text-3xl text-slate-600 font-bold">My Account</h2>
            </div>

			<AccountInfo />
        </div>
    )
}

export default AccountPage