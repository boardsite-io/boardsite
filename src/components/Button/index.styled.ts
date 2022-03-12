import styled, { css } from "styled-components"

interface Props {
    $withIcon: boolean
}

export const StyledButton = styled.button<Props>`
    cursor: pointer;
    color: ${({ theme }) => theme.palette.secondary.contrastText};
    background: ${({ theme }) => theme.palette.secondary.main};
    padding: 0.5rem 1.5rem;
    border-width: 0;
    border-radius: var(--button-border-radius);
    transition: all 100ms ease-in-out;
    box-shadow: var(--box-shadow);
    height: min-content;
    width: 100%;

    &:hover {
        filter: brightness(120%);
    }

    &:disabled {
        cursor: not-allowed;
        background: #00000044;
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
