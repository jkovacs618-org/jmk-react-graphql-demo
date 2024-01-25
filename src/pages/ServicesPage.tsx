import { observer } from 'mobx-react'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Services: React.FC = () => {
    return (
        <div className="relative flex flex-col">
            <Outlet />
        </div>
    )
}

const ServicesPage = observer(Services)
export default ServicesPage
