import { ExpandableIcon } from "components"
import React from "react"
import { SET_MAIN_SUB_MENU } from "redux/menu"
import { MainSubMenuState } from "redux/menu/index.types"
import store from "redux/store"
import { ItemWrap, ItemButton } from "./index.styled"

interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: JSX.Element
    icon?: JSX.Element
    isMainMenu?: boolean
    expandMenu?: MainSubMenuState
    warning?: boolean
}

const MenuItem: React.FC<MenuItemProps> = ({
    text,
    icon,
    isMainMenu,
    expandMenu,
    warning = false,
    ...restProps
}) => {
    if (expandMenu) {
        const expandSubMenu = () => {
            store.dispatch(SET_MAIN_SUB_MENU(expandMenu))
        }
        return (
            <ItemWrap>
                <ItemButton
                    {...restProps}
                    $warning={warning}
                    onClick={expandSubMenu}
                    onMouseEnter={expandSubMenu}
                >
                    {text}
                    <ExpandableIcon />
                </ItemButton>
            </ItemWrap>
        )
    }
    const closeSubMenu = () => {
        const subMenuOpen =
            store.getState().menu.mainSubMenuState !== MainSubMenuState.Closed

        if (isMainMenu && subMenuOpen) {
            store.dispatch(SET_MAIN_SUB_MENU(MainSubMenuState.Closed))
        }
    }
    return (
        <ItemWrap>
            <ItemButton
                {...restProps}
                $warning={warning}
                onMouseEnter={closeSubMenu}
            >
                {text}
                {icon}
            </ItemButton>
        </ItemWrap>
    )
}

export default MenuItem
