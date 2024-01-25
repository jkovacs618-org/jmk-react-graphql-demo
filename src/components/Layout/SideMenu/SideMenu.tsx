import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSideMenu } from '../../../contexts/SideMenuContext'
import SlidingPane from 'react-sliding-pane'
import SideMenuLink from './SideMenuLink'
import 'react-sliding-pane/dist/react-sliding-pane.css'
import { useAuth } from '../../../contexts/AuthContext'

const SideMenu: React.FC = () => {
    const { menuState, closeMenu } = useSideMenu()
    const { authUser } = useAuth()

    return (
        <div>
            <SlidingPane
                hideHeader={true}
                isOpen={menuState}
                from="left"
                width="250px"
                onRequestClose={closeMenu}
                className="rounded px-0"
            >
                <div className="flex mb-2">
                    <div className="ml-4 w-48 text-ellipsis whitespace-nowrap overflow-hidden">
                        {authUser ? authUser?.nameFirst + ' ' + authUser?.nameLast : ''}
                    </div>
                    <div className="ml-auto mr-5">
                        <FontAwesomeIcon
                            icon="times"
                            className="text-2xl text-gray-500 font-bold cursor-pointer"
                            onClick={closeMenu}
                        />
                    </div>
                    <div className="float-none"></div>
                </div>

                <div className="float-none">
                    <SideMenuLink
                        path="/dashboard"
                        label="Dashboard"
                        prefix="fas"
                        icon="table-cells-large"
                    />
                    <SideMenuLink path="/family" label="Family" prefix="fas" icon="people-roof" />
                    <SideMenuLink path="/events" label="Events" prefix="far" icon="calendar-days" />
                    <SideMenuLink
                        path="/services"
                        label="Accounts"
                        prefix="fas"
                        icon="building-user"
                    />
                </div>
            </SlidingPane>
        </div>
    )
}

export default SideMenu
