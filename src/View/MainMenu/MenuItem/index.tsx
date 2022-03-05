import React from "react"
import { ItemWrap, ItemButton } from "./index.styled"

interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: JSX.Element | string
    icon?: JSX.Element
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
                {text}
                {icon}
            </ItemButton>
            {children}
        </ItemWrap>
    )
}

export default MenuItem
