import { observer } from 'mobx-react'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Services: React.FC = () => {
    return (
        <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'left', alignItems: 'left', flexDirection: 'column' }}>
            <Outlet />
        </div>
    )
}

const ServicesPage = observer(Services)
export default ServicesPage
