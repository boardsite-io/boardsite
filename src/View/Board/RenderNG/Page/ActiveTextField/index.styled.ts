import type { Textfield as TextfieldObject } from "drawing/stroke/index.types"
import styled from "styled-components"

export const Textfield = styled.textarea`
    background: ${({ theme }) => theme.palette.editor.paper}ee;
    box-shadow: var(--box-shadow);
    position: absolute;
    outline: none;
    border: 1px solid ${({ theme }) => theme.palette.secondary.main};
    border-radius: var(--border-radius);
`

export const TextfieldBackground = styled.button<Omit<TextfieldObject, "text">>`
    position: absolute;
    background: transparent;
    outline: none;
    border: none;

    textarea {
        text-align: ${({ hAlign }) => hAlign};
        font-weight: ${({ fontWeight }) => fontWeight};
        font-family: ${({ font }) => font};
        font-size: ${({ fontSize }) => fontSize}px;
        line-height: ${({ lineHeight }) => lineHeight}px;
    }
`
