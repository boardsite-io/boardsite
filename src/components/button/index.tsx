import React from "react"
import { StyledButton } from "./index.styled"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    withIcon?: boolean
    fullWidth?: boolean
}

const Button: React.FC<ButtonProps> = ({
    withIcon = false,
    children,
    ...props
}) => (
    <StyledButton type="button" $withIcon={withIcon} {...props}>
        {children}
    </StyledButton>
)

export default Button
