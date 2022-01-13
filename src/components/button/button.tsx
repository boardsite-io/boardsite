import { Variant } from "consts"
import React from "react"
import { StyledButton } from "./button.styled"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant
    withIcon?: boolean
    fullWidth?: boolean
}

const Button: React.FC<ButtonProps> = ({
    variant = Variant.Primary,
    withIcon = false,
    fullWidth = false,
    children,
    ...props
}) => (
    <StyledButton
        type="button"
        $variant={variant}
        $withIcon={withIcon}
        $fullWidth={fullWidth}
        {...props}>
        {children}
    </StyledButton>
)

export default Button
