import styled, { css } from "styled-components"
import { active, inactive } from "../pageoptions.styled"

export const SizePresets = styled.form`
    display: flex;
    justify-content: space-between;
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
const a4height = "5rem"
const a4width = `calc(${a4height} / 1.4142)`

export const SizePresetLabel = styled.label`
    display: flex;
    flex-direction: column;
    align-items: center;
    /* gap: 0.5rem; */
    width: ${a4height};
`

interface props {
    $active: boolean
}
export const A4Landscape = styled.button<props>`
    ${sharedStyle}
    height: ${a4height};
    width: ${a4width};
`
export const A4Portrait = styled.button<props>`
    ${sharedStyle};
    margin-top: calc((${a4height} - ${a4width}) / 2);
    height: ${a4width};
    width: ${a4height};
`
export const Square = styled.button<props>`
    ${sharedStyle}
    height: 5rem;
    width: 5rem;
`