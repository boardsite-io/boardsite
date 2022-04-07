import styled, { css } from "styled-components"

export const WidthPresets = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-content: space-between;
    align-items: center;
    border-radius: var(--border-radius);
`

interface PresetProps {
    $active: boolean
}

export const Preset = styled.button<PresetProps>`
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    border-radius: var(--border-radius);
    height: var(--icon-button-size);
    width: var(--icon-button-size);
    transition: all ease-in-out 250ms;
    ${({ $active }) => ($active ? activePreset : inActivePreset)};

    &:hover {
        cursor: pointer;
    }
`
const activePreset = css`
    background: ${({ theme }) => theme.palette.editor.selected};
`
const inActivePreset = css`
    background: transparent;
`

interface StrokeWidth {
    $strokeWidth: number
}

export const WidthPresetInnerDot = styled.div<StrokeWidth>`
    display: flex;
    background: ${({ theme }) => theme.palette.primary.contrastText};
    ${({ $strokeWidth }) =>
        css`
            height: ${$strokeWidth}px;
            width: ${$strokeWidth}px;
            min-width: ${$strokeWidth}px; /* Adjustment for mobile */
        `};
    border-radius: 50%;
`
