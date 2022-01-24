import styled, { css } from "styled-components"

interface Props {
    $withIcon: boolean
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
    color: var(--cPrimary);
    background: var(--cDetails);
    box-shadow: var(--box-shadow);

    &:hover {
        background: var(--cDetails2);
    }

    ${({ $withIcon }) => ($withIcon ? iconStyle : noIconStyle)};
    svg {
        height: 1rem;
        width: 1rem;
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
