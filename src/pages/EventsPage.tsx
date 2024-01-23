import React from 'react'
import { Outlet } from 'react-router-dom'
import { observer } from 'mobx-react'
// import EventsStore from '../stores/EventsStore'

const EventsPage: React.FC = () => {
    // const eventsStore = useContext(EventsStore)

    return (
        <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'left', alignItems: 'left', flexDirection: 'column' }}>
            <Outlet />
        </div>
    )
}

const EventsPageObserver = observer(EventsPage)

export default EventsPageObserver
