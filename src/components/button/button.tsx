import React from "react"
import { Variants } from "types"
import { StyledButton } from "./button.styled"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variants
}

const Button: React.FC<ButtonProps> = ({
    variant = Variants.Primary,
    children,
    ...props
}) => (
    <StyledButton type="button" $variant={variant} {...props}>
        {children}
    </StyledButton>
)

export default Button
