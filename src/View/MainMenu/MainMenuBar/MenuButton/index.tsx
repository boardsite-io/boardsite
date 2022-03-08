import { MenuIcon } from "components"
import React, { memo } from "react"
import { StyledMainMenuButton } from "./index.styled"

const MenuButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> =
    memo((props) => {
        return (
            <StyledMainMenuButton type="button" {...props}>
                <MenuIcon />
            </StyledMainMenuButton>
        )
    })
export default MenuButton
