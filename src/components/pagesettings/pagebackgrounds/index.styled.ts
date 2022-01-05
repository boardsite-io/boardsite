import styled, { css } from "styled-components"
import { active, inactive } from "../index.styled"

export const Backgrounds = styled.form`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const sharedStyle = css<props>`
    border: none;
    background: white;
    /* remove a pixel for pixel perfect symmetry */
    height: calc(5rem - 1px);
    width: calc(5rem - 1px);
    border-radius: var(--button-border-radius);
    ${({ $active }) => ($active ? active : inactive)};
    &:hover {
        cursor: pointer;
    }
`

interface props {
    $active: boolean
}

export const Blank = styled.button<props>`
    ${sharedStyle}
`
export const Checkered = styled.button<props>`
    ${sharedStyle}
    background-image: repeating-linear-gradient(
            90deg,
            transparent 0,
            transparent 0.95rem,
            teal 0.95rem,
            teal 1rem
        ),
        repeating-linear-gradient(
            white 0,
            white 0.95rem,
            teal 0.95rem,
            teal 1rem
        );
`
export const Ruled = styled.button<props>`
    ${sharedStyle}
    background-image: repeating-linear-gradient(
        white 0, 
        white 0.95rem,
        teal 0.95rem,
        teal 1rem
    );
`
