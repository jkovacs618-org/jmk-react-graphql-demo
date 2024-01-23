import React from 'react'
import { Outlet } from 'react-router-dom'
import { observer } from 'mobx-react'

const FamilyPage: React.FC = () => {
    return (
        <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'left', alignItems: 'left', flexDirection: 'column' }}>
            <Outlet />
        </div>
    )
}

const FamilyPageObserver = observer(FamilyPage)

export default FamilyPageObserver
