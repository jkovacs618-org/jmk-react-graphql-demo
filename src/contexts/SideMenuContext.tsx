import React, { ReactNode, useContext } from 'react'

const SideMenuContext = React.createContext({
    menuState: false,
    openMenu: () => {},
    closeMenu: () => {},
})

export function useSideMenu() {
    return useContext(SideMenuContext)
}

export const SideMenuProvider = ({ children }: { children?: ReactNode }) => {
    const [menuState, setMenuState] = React.useState<boolean>(false)

    const openMenu = () => {
        setMenuState(true)
    }
    const closeMenu = () => {
        setMenuState(false)
    }

    return (
        <SideMenuContext.Provider value={{ menuState, openMenu, closeMenu }}>
            {children}
        </SideMenuContext.Provider>
    )
}
