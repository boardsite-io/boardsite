import React from "react"
import { StyledIconButton } from "./iconbutton.styled"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean
}

const IconButton: React.FC<ButtonProps> = ({ active, ...props }) => (
    <StyledIconButton type="button" $active={active} {...props} />
)

export default IconButton
