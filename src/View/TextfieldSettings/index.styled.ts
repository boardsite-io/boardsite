import { HexColorPicker } from "react-colorful"
import styled from "styled-components"
import type { TextfieldAttrs as TextfieldObject } from "drawing/stroke/index.types"

export const FontSizes = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    column-gap: 0.5rem;
    row-gap: 0.5rem;

    button {
        margin: 0;
        padding: 0.5rem;
    }
`

export const ContentWrapper = styled.div`
    display: grid;
    gap: 1rem;
    padding: 1rem;
`

export const CustomColorPicker = styled(HexColorPicker)`
    /* Override the 200px height and width */
    width: 100% !important;
    height: 10rem !important;

    .react-colorful__saturation-pointer,
    .react-colorful__alpha-pointer,
    .react-colorful__hue-pointer {
        border: 2px solid;
        border-color: ${({ theme }) => theme.palette.primary.contrastText};
    }

    .react-colorful__saturation-pointer,
    .react-colorful__alpha-pointer {
        width: var(--style-picker-hue-width);
        height: var(--style-picker-hue-width);
        border-radius: 50%;
    }

    .react-colorful__hue-pointer {
        width: var(--style-picker-hue-width);
        height: var(--style-picker-hue-height);
        border-radius: calc(var(--style-picker-hue-width) / 2);
    }

    .react-colorful__hue {
        height: var(--style-picker-hue-height);
        border-radius: 0 0 var(--border-radius) var(--border-radius);
        &:active {
            /* override component style */
            height: var(--style-picker-hue-height);
        }
    }
`

export const TextPreview = styled.p<Omit<TextfieldObject, "text">>`
    transition: all ease-in-out 100ms;
    background: ${({ theme }) => theme.palette.primary.main};
    box-shadow: var(--box-shadow);
    border-radius: var(--border-radius);
    width: auto;
    padding: 0.5rem;
    margin: 0;
    /* text-align: ${({ hAlign }) => hAlign}; */
    font-weight: ${({ fontWeight }) => fontWeight};
    font-family: ${({ font }) => font};
    font-size: ${({ fontSize }) => fontSize}px;
    line-height: ${({ lineHeight }) => lineHeight}px;
`

export const TextPreviewWrapper = styled.div`
    border-radius: var(--border-radius);
    background: ${({ theme }) => theme.palette.primary.main}66;
    position: absolute;
    display: flex;
    margin-bottom: 4px;
    padding: 4px 0;
    justify-content: center;
    height: auto;
    bottom: 100%;
    width: 100%;
    touch-action: none;
    pointer-events: none;
`
