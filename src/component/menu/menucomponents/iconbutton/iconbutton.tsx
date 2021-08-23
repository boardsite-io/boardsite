import React from "react"
import { StyledIconButton } from "./iconbutton.styled"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean
    background?: string
}

const IconButton: React.FC<ButtonProps> = ({
    active,
    background,
    ...props
}) => (
    <StyledIconButton
        type="button"
        $active={active}
        $background={background}
        {...props}
    />
)

export default IconButton
