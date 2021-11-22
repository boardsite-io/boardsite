import { Variant } from "consts"
import styled, { css } from "styled-components"

interface Props {
    $variant: Variant
    $withIcon: boolean
    $fullWidth: boolean
}

export const StyledButton = styled.button<Props>`
    text-transform: uppercase;
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
        $variant === Variant.Primary ? primaryStyle : secondaryStyle};
    ${({ $withIcon }) => ($withIcon ? iconStyle : noIconStyle)};
    svg {
        height: 1rem;
        width: 1rem;
    }
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
    align-items: center;
    gap: 1rem;
`

const noIconStyle = css`
    display: inline-block;
    text-align: center;
`
