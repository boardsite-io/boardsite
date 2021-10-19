import styled, { css } from "styled-components"

export const Backgrounds = styled.form`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
`

const sharedStyle = css<props>`
    border: none;
    /* remove a pixel for pixel perfect symmetry */
    height: calc(5rem - 1px);
    width: calc(5rem - 1px);
    border-radius: var(--button-border-radius);
    ${({ $active }) => ($active ? active : inactive)};
    &:hover {
        cursor: pointer;
    }
`
const active = css`
    box-shadow: 0 0 0 4px var(--color3);
`
const inactive = css`
    box-shadow: 0 0 0 1px green, var(--box-shadow);
`

interface props {
    $active: boolean
}
export const Blank = styled.input<props>`
    ${sharedStyle}
    background: white;
`
export const Checkered = styled.input<props>`
    ${sharedStyle}
    background-image: repeating-linear-gradient(
            90deg,
            transparent 0,
            transparent 0.95rem,
            teal 0.95rem,
            teal 1rem
        ), repeating-linear-gradient(
            white 0, 
            white 0.95rem,
            teal 0.95rem,
            teal 1rem
        );
`
export const Ruled = styled.input<props>`
    ${sharedStyle}
    background-image: repeating-linear-gradient(
        white 0, 
        white 0.95rem,
        teal 0.95rem,
        teal 1rem
    );
`
