import styled, { css } from "styled-components"

export const WidthPresets = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-content: space-between;
    align-items: center;
    border-radius: ${({ theme }) => theme.borderRadius};
`

interface PresetProps {
    $active: boolean
}

export const Preset = styled.button<PresetProps>`
    ${({ theme, $active }) => css`
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        border-radius: ${theme.borderRadius};
        height: ${theme.iconButton.size};
        width: ${theme.iconButton.size};
        transition: all ease-in-out 250ms;

        ${$active
            ? css`
                  background: ${({ theme }) => theme.palette.editor.selected};
              `
            : css`
                  background: transparent;
              `};
    `}
`

interface StrokeWidth {
    $strokeWidth: number
}

export const WidthPresetInnerDot = styled.div<StrokeWidth>`
    ${({ $strokeWidth, theme }) => css`
        display: flex;
        background: ${theme.palette.primary.contrastText};
        height: ${$strokeWidth}px;
        width: ${$strokeWidth}px;
        min-width: ${$strokeWidth}px; /* Adjustment for mobile */
        border-radius: 50%;
    `};
`
