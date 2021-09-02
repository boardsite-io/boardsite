import styled, { css } from "styled-components"
import { Variants } from "types"

interface Props {
    $variant: Variants
}

export const StyledButton = styled.button`
    display: inline-block;
    text-align: center;
    padding: 0.5rem 1.5rem;
    box-shadow: var(--box-shadow);
    text-transform: uppercase;
    outline: none;
    border-width: 0;
    border-radius: var(--button-border-radius);
    transition: all 100ms ease-in-out;
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
