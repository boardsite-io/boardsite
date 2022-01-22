import React from "react"
import { GeneralMenuState, SET_GENERAL_MENU } from "redux/menu/menu"
import store from "redux/store"
import { ItemWrap, ItemButton } from "./index.styled"

interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: JSX.Element
    isMainMenu?: boolean
    icon?: JSX.Element
    expandMenu?: GeneralMenuState
    warning?: boolean
}

const MenuItem: React.FC<MenuItemProps> = ({
    isMainMenu,
    text,
    icon,
    expandMenu,
    warning = false,
    ...restProps
}) => {
    if (expandMenu) {
        const expandSubMenu = () => {
            store.dispatch(SET_GENERAL_MENU(expandMenu))
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
                    {icon}
                </ItemButton>
            </ItemWrap>
        )
    }
    const closeSubMenu = () => {
        const subMenuOpen =
            store.getState().menu.generalMenuState !== GeneralMenuState.Default

        if (isMainMenu && subMenuOpen) {
            store.dispatch(SET_GENERAL_MENU(GeneralMenuState.Default))
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
