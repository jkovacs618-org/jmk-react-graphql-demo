import React from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NavigationUser from './NavigationUser'
import SideMenu from '@/components/Layout/SideMenu/SideMenu'
import { useSideMenu } from '@/contexts/SideMenuContext'
import 'react-sliding-pane/dist/react-sliding-pane.css'
import './nav.css'

const Navigation: React.FC = () => {
    const { openMenu } = useSideMenu()
    return (
        <div>
            <nav className="flex items-center bg-slate-800 h-16 pl-6 pr-8 text-white">
                <div className="flex gap-4">
                    <a onClick={openMenu}>
                        <FontAwesomeIcon
                            icon="bars"
                            className="text-3xl mt-1 mr-4 cursor-pointer text-white"
                        />
                    </a>

                    <NavLink to="/dashboard" className="nav-link">
                        Dashboard
                    </NavLink>
                </div>
                <div className="ml-auto">
                    <NavigationUser />
                </div>
            </nav>

            <SideMenu />
        </div>
    )
}

export default Navigation
