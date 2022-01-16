import React from "react"
import { StyledIconButton } from "./index.styled"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    deactivated?: boolean
    active?: boolean
    background?: string
}

const IconButton: React.FC<ButtonProps> = ({
    deactivated,
    active,
    background,
    ...props
}) => (
    <StyledIconButton
        type="button"
        $deactivated={deactivated}
        $active={active}
        $background={background}
        {...props}
    />
)

export default IconButton
