import React from "react"

interface ButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
}

const NumberInput: React.FC<ButtonProps> = ({ label, ...props }) => (
    <label htmlFor={props.id}>
        {label}
        <input type="number" {...props} />
    </label>
)

export default NumberInput
