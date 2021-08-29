import styled, { css } from "styled-components"
import { Variants } from "types"

interface Props {
    $variant: Variants
}

export const StyledButton = styled.button`
    padding: 0.2rem;
    height: 2rem;
    box-shadow: var(--box-shadow);
    text-align: center;
    text-transform: uppercase;
    justify-self: center;
    outline: none;
    border-width: 0;
    border-radius: var(--button-border-radius);
    transition: all 250ms ease-in-out;
    &:hover {
        cursor: pointer;
    }
    ${(props: Props) =>
        props.$variant === Variants.Primary ? primaryStyle : secondary};
`

const primaryStyle = css`
    color: var(--primary);
    background: var(--secondary);
    &:hover {
        color: var(--secondary);
        background: var(--primary);
    }
`

const secondary = css`
    color: var(--secondary);
    background: var(--primary);
    &:hover {
        color: var(--primary);
        background: var(--secondary);
    }
`
