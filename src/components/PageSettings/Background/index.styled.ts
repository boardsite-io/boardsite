import styled, { css } from "styled-components"
import { active, inactive, SELECTION_SIZE } from "../index.styled"

export const Backgrounds = styled.form`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const sharedStyle = css<props>`
    border: none;
    background: white;
    /* remove a pixel for pixel perfect symmetry */
    height: calc(${SELECTION_SIZE} - 1px);
    width: calc(${SELECTION_SIZE} - 1px);
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
            transparent 14px,
            teal 14px,
            teal 15px
        ),
        repeating-linear-gradient(
            white 0,
            white 14px,
            teal 14px,
            teal 15px
        );
`
export const Ruled = styled.button<props>`
    ${sharedStyle}
    background-image: repeating-linear-gradient(
        white 0,
        white 14px,
        teal 14px,
        teal 15px
    );
`
