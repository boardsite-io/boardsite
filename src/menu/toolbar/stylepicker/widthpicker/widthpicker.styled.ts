import styled from "styled-components"

export const WidthPresets = styled.div`
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
    /* grid-gap: 2px; */
    border-radius: var(--menubar-border-radius);
    background: var(--color2);
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
    border-radius: 100%;
    border: ${({ $active }) => ($active ? "2px solid var(--color7)" : "none")};
    background: ${({ $active }) => ($active ? "#00ff0088" : "#ffffff")};
    height: 1.5rem;
    width: 1.5rem;
    margin: 5px;
    transition: ease-in-out 100ms;
    &:hover {
        transform: scale(1.2, 1.2);
        cursor: pointer;
        box-shadow: 0 0 1rem 0 var(--color7);
    }
`

interface StrokeWidth {
    $strokeWidth: number
}
export const WidthPresetInnerDot = styled.div<StrokeWidth>`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    background: black;
    height: ${({ $strokeWidth }) => `${$strokeWidth}px`};
    width: ${({ $strokeWidth }) => `${$strokeWidth}px`};
    border-radius: 100%;
`
