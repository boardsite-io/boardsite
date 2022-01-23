import React from "react"
import { StyledIconButton } from "./index.styled"

export interface IconButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    deactivated?: boolean
    active?: boolean
    icon: JSX.Element
}

const IconButton: React.FC<IconButtonProps> = ({
    deactivated,
    active,
    icon,
    ...props
}) => (
    <StyledIconButton
        type="button"
        $deactivated={deactivated}
        $active={active}
        {...props}
    >
        {icon}
    </StyledIconButton>
)

export default IconButton
