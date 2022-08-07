import { IconButton } from "components"
import type { TextfieldAttrs as TextfieldObject } from "drawing/stroke/index.types"
import styled from "styled-components"

type TextareaProps = {
    width: number
    height: number
}

export const Textarea = styled.textarea<TextareaProps>`
    background: ${({ theme }) => theme.palette.editor.paper}ee;
    box-shadow: var(--box-shadow);
    position: absolute;
    outline: none;
    border-radius: var(--border-radius);
    border: none;
    width: ${({ width }) => width}px;
    height: ${({ height }) => height}px;
`

export const TextfieldSettingsButton = styled(IconButton)`
    margin: 0;
    padding: 2px;
    position: absolute;
    top: 0px;
    right: 2px;
    height: 2rem;
    width: 2rem;
    box-shadow: var(--box-shadow);
`

export const TEXTFIELD_PADDING = 2

export const AttributesProvider = styled.div<Omit<TextfieldObject, "text">>`
    position: absolute;

    textarea {
        text-align: ${({ hAlign }) => hAlign};
        font-weight: ${({ fontWeight }) => fontWeight};
        font-family: ${({ font }) => font};
        font-size: ${({ fontSize }) => fontSize}px;
        line-height: ${({ lineHeight }) => lineHeight}px;
        padding: ${TEXTFIELD_PADDING}px;
    }
`

export const TextfieldBackground = styled.button`
    position: absolute;
    background: transparent;
    outline: none;
    border: none;
`
