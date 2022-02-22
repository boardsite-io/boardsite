import styled, { css } from "styled-components"

export const WidthPresets = styled.div`
    display: grid;
    justify-content: space-between;
    align-items: center;
    column-gap: var(--toolbar-gap);
    grid-template-columns: repeat(2, 1fr);
    border-radius: var(--border-radius);
    background: var(--cPrimary);
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
`
const activePreset = css`
    background: var(--cSelected);
`
const inActivePreset = css`
    background: transparent;
    &:hover {
        cursor: pointer;
    }
`

interface StrokeWidth {
    $strokeWidth: number
}

export const WidthPresetInnerDot = styled.div<StrokeWidth>`
    display: flex;
    background: var(--cSecondary);
    ${({ $strokeWidth }) =>
        css`
            height: ${$strokeWidth}px;
            width: ${$strokeWidth}px;
            min-width: ${$strokeWidth}px; /* Adjustment for mobile */
        `};
    border-radius: 50%;
`