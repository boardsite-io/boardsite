import React from "react"
import { ItemWrap, ItemButton, TextWrap } from "./index.styled"

interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: JSX.Element | string
    icon?: JSX.Element | null | boolean
    expandMenu?: () => void
    warning?: boolean
}

const MenuItem: React.FC<MenuItemProps> = ({
    text,
    icon,
    expandMenu,
    warning = false,
    onClick,
    children,
    ...restProps
}) => {
    return (
        <ItemWrap>
            <ItemButton
                {...restProps}
                $warning={warning}
                onClick={(e) => {
                    expandMenu?.()
                    onClick?.(e)
                }}
                onMouseEnter={() => expandMenu?.()}
            >
                <TextWrap>{text}</TextWrap>
                {icon}
            </ItemButton>
            {children}
        </ItemWrap>
    )
}

export default MenuItem
