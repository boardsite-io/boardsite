import styled, { css } from "styled-components"
import { Variants } from "types"

interface Props {
    $variant: Variants
    $withIcon: boolean
    $fullWidth: boolean
}

export const StyledButton = styled.button<Props>`
    padding: 0.5rem 1.5rem;
    outline: none;
    border-width: 0;
    border-radius: var(--button-border-radius);
    transition: all 100ms ease-in-out;
    &:hover {
        cursor: pointer;
    }
    width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
    ${({ $variant }) =>
        $variant === Variants.Primary ? primaryStyle : secondaryStyle};
    ${({ $withIcon }) => ($withIcon ? iconStyle : noIconStyle)};
`

const primaryStyle = css`
    color: var(--color1);
    background: var(--color3);
    box-shadow: var(--box-shadow);
    &:hover {
        background: var(--color4);
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

const iconStyle = css`
    display: flex;
    /* justify-content: center; */
    gap: 1rem;
    text-transform: uppercase;
`

const noIconStyle = css`
    display: inline-block;
    text-align: center;
    text-transform: uppercase;
`
