import styled, { css } from "styled-components"
import { Variants } from "types"

interface Props {
    $variant: Variants
}

export const StyledButton = styled.button<Props>`
    display: inline-block;
    text-align: center;
    padding: 0.5rem 1.5rem;
    text-transform: uppercase;
    outline: none;
    border-width: 0;
    border-radius: var(--button-border-radius);
    transition: all 100ms ease-in-out;
    &:hover {
        cursor: pointer;
    }
    ${({ $variant }) =>
        $variant === Variants.Primary ? primaryStyle : secondaryStyle};
`

const primaryStyle = css`
    color: var(--color1);
    background: var(--color2);
    box-shadow: var(--box-shadow);
    &:hover {
        color: var(--color2);
        background: var(--color1);
    }
`

const secondaryStyle = css`
    color: var(--color2);
    background: var(--color1);
    box-shadow: var(--box-shadow);
    &:hover {
        color: var(--color1);
        background: var(--color2);
    }
`
