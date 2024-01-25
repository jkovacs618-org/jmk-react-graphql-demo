import React from 'react'
import { Outlet } from 'react-router-dom'
import { observer } from 'mobx-react'

const FamilyPage: React.FC = () => {
    return (
        <div className="relative flex flex-col">
            <Outlet />
        </div>
    )
}

const FamilyPageObserver = observer(FamilyPage)

export default FamilyPageObserver
