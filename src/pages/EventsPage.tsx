import React from 'react'
import { Outlet } from 'react-router-dom'
import { observer } from 'mobx-react'

const EventsPage: React.FC = () => {
    return (
        <div className="relative flex flex-col">
            <Outlet />
        </div>
    )
}

const EventsPageObserver = observer(EventsPage)

export default EventsPageObserver
