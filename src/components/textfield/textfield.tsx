import React, { useState } from "react"
import {
    AlignItems,
    InputBar,
    InputHelperText,
    InputLabel,
    InputWrapper,
    StyledInput,
    TextAlign,
} from "./textfield.styled"

interface ButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
    helperText?: string
    label?: string
    value: string
    align?: TextAlign
}

const TextField: React.FC<ButtonProps> = ({
    helperText = "",
    label = "",
    value = "",
    align = "center" as TextAlign,
    ...props
}) => {
    const [hasFocus, setFocus] = useState(false)
    const alignTextToItems = {
        center: "center",
        left: "flex-start",
        right: "flex-end",
    }
    const alignItems = alignTextToItems[align]

    return (
        <InputWrapper $alignItems={alignItems as AlignItems}>
            <StyledInput
                $textAlign={align}
                type="text"
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                value={value}
                {...props}
            />
            <InputBar $hasFocus={hasFocus} />
            <InputLabel $hasFocus={hasFocus || value !== ""}>
                {label}
            </InputLabel>
            <InputHelperText>{helperText}</InputHelperText>
        </InputWrapper>
    )
}

export default TextField
