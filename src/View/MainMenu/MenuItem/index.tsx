import { ExpandableIcon } from "components"
import React from "react"
import { menu } from "state/menu"
import { MainSubMenuState } from "state/menu/state/index.types"
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
            menu.setMainSubMenu(expandMenu)
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
            menu.getState().mainSubMenuState !== MainSubMenuState.Closed

        if (isMainMenu && subMenuOpen) {
            menu.setMainSubMenu(MainSubMenuState.Closed)
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
