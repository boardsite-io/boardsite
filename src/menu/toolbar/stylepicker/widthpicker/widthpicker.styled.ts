import styled, { css } from "styled-components"

export const WidthPresets = styled.div`
    display: grid;
    justify-content: space-between;
    align-items: center;
    column-gap: var(--button-gap);
    padding: var(--style-picker-padding);
    grid-template-columns: repeat(2, 1fr);
    border-radius: var(--menubar-border-radius);
    background: var(--color2);
`

interface PresetProps {
    $active: boolean
}
export const Preset = styled.div<PresetProps>`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    height: var(--icon-button-size);
    width: var(--icon-button-size);
    transition: all ease-in-out 250ms;
    ${({ $active }) => ($active ? activePreset : inActivePreset)};
`
const activePreset = css`
    background: var(--color8);
    box-shadow: var(--button-active-box-shadow);
    div {
        background: var(--color1);
    }
`
const inActivePreset = css`
    div {
        background: var(--color1);
    }
    &:hover {
        cursor: pointer;
        div {
            box-shadow: var(--button-hover-box-shadow);
        }
    }
`

interface StrokeWidth {
    $strokeWidth: number
}
export const WidthPresetInnerDot = styled.div<StrokeWidth>`
    height: ${({ $strokeWidth }) => `${$strokeWidth}px`};
    width: ${({ $strokeWidth }) => `${$strokeWidth}px`};
    border-radius: 50%;
`
