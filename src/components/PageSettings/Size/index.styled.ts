import styled, { css } from "styled-components"
import { active, inactive, SELECTION_SIZE } from "../index.styled"

export const SizePresets = styled.form`
    display: flex;
    gap: 2rem;
    justify-content: center;
`

const sharedStyle = css<props>`
    background: white;
    border: none;
    border-radius: var(--button-border-radius);
    ${({ $active }) => ($active ? active : inactive)};
    &:hover {
        cursor: pointer;
    }
`

// Define size relatively to A4 page height
const a4height = SELECTION_SIZE
const a4width = `calc(${a4height} / 1.4142)`

export const SizePresetLabel = styled.label`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: ${a4height};
`

interface props {
    $active: boolean
}

export const A4Portrait = styled.button<props>`
    ${sharedStyle}
    height: ${a4height};
    width: ${a4width};
`
export const A4Landscape = styled.button<props>`
    ${sharedStyle};
    margin-top: calc((${a4height} - ${a4width}) / 2);
    height: ${a4width};
    width: ${a4height};
`
