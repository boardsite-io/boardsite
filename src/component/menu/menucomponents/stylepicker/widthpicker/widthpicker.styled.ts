import styled from "styled-components"

export const WidthPresets = styled.div`
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
    /* grid-gap: 2px; */
    border-radius: var(--menubar-border-radius);
    background: var(--menubar-background);
    align-items: center;
    justify-items: center;
`

interface PresetProps {
    $active: boolean
}
export const Preset = styled.div<PresetProps>`
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-radius: 1337px;
    border: ${({ $active }) =>
        $active ? "2px solid var(--active-tool-color)" : "none"};
    background: ${({ $active }) => ($active ? "#00ff0088" : "#ffffff")};
    height: 22px;
    width: 22px;
    margin: 5px;
`

interface StrokeWidth {
    $strokeWidth: number
}
export const WidthPresetInnerDot = styled.div<StrokeWidth>`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    border-radius: var(--menubar-border-radius);
    background: black;
    height: ${({ $strokeWidth }) => `${$strokeWidth}px`};
    width: ${({ $strokeWidth }) => `${$strokeWidth}px`};
    border-radius: 100px;
`
