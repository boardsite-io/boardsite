import React, { useState } from "react"
import {
    AlignItems,
    InputBar,
    InputHelperText,
    InputLabel,
    InputWrapper,
    OuterWrap,
    StyledInput,
    TextAlign,
} from "./index.styled"

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    helperText?: JSX.Element
    label?: string
    value: string
    align?: TextAlign
    error?: boolean
}

const TextField: React.FC<TextFieldProps> = ({
    helperText = "",
    label = "",
    value = "",
    align = "center" as TextAlign,
    error = false,
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
        <OuterWrap>
            <InputWrapper $alignItems={alignItems as AlignItems}>
                <StyledInput
                    $textAlign={align}
                    type="text"
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    value={value}
                    {...props}
                />
                <InputBar $hasFocus={hasFocus} $error={error} />
                <InputLabel $hasFocus={hasFocus || value !== ""}>
                    {label}
                </InputLabel>
                <InputHelperText>{helperText}</InputHelperText>
            </InputWrapper>
        </OuterWrap>
    )
}

export default TextField
