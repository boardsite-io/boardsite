import React from "react"
import { Input, Label } from "./index.styled"

interface ButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
}

const NumberInput: React.FC<ButtonProps> = ({ label, ...props }) => (
    <Label htmlFor={props.id}>
        {label}
        <Input type="number" {...props} />
    </Label>
)

export default NumberInput
