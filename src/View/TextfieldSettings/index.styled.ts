import { HexColorPicker } from "react-colorful"
import styled, { css } from "styled-components"
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
    ${({ theme }) => css`
        /* Override the 200px height and width */
        width: 100% !important;
        height: 10rem !important;

        .react-colorful__saturation-pointer,
        .react-colorful__alpha-pointer,
        .react-colorful__hue-pointer {
            border: 2px solid;
            border-color: ${theme.palette.primary.contrastText};
        }

        .react-colorful__saturation-pointer,
        .react-colorful__alpha-pointer {
            width: ${theme.colorPicker.hue.width};
            height: ${theme.colorPicker.hue.width};
            border-radius: 50%;
        }

        .react-colorful__hue-pointer {
            width: ${theme.colorPicker.hue.width};
            height: ${theme.colorPicker.hue.height};
            border-radius: calc(${theme.colorPicker.hue.width} / 2);
        }

        .react-colorful__hue {
            height: ${theme.colorPicker.hue.height};
            border-radius: 0 0 ${theme.borderRadius} ${theme.borderRadius};
            &:active {
                /* override component style */
                height: ${theme.colorPicker.hue.height};
            }
        }
    `}
`

export const TextPreview = styled.p<Omit<TextfieldObject, "text">>`
    ${({ theme, fontWeight, font, fontSize, lineHeight }) => css`
        transition: all ease-in-out 100ms;
        background: ${theme.palette.primary.main};
        box-shadow: ${theme.boxShadow};
        border-radius: ${theme.borderRadius};
        width: auto;
        padding: 0.5rem;
        margin: 0;
        /* text-align: {hAlign} */
        font-weight: ${fontWeight};
        font-family: ${font};
        font-size: ${fontSize}px;
        line-height: ${lineHeight}px;
    `}
`

export const TextPreviewWrapper = styled.div`
    ${({ theme }) => css`
        border-radius: ${theme.borderRadius};
        background: ${theme.palette.primary.main}66;
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
    `}
`
