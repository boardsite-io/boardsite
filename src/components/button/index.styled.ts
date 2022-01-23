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
    color: var(--cMenuItems);
    background: var(--cDetails);
    box-shadow: var(--box-shadow);
    &:hover {
        background: var(--cDetails2);
    }
`

const secondaryStyle = css`
    color: var(--cMenuBackground);
    background: var(--cMenuItems);
    box-shadow: var(--box-shadow);
    &:hover {
        color: var(--cMenuItems);
        background: var(--cMenuBackground);
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
