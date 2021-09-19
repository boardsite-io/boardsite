import React from "react"
import { Variants } from "types"
import { StyledButton } from "./button.styled"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variants
    withIcon?: boolean
    fullWidth?: boolean
}

const Button: React.FC<ButtonProps> = ({
    variant = Variants.Primary,
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
