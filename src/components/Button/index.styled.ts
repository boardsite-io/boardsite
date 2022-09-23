import styled, { css } from "styled-components"

interface Props {
    $withIcon: boolean
}

export const StyledButton = styled.button<Props>`
    display: flex;
    align-items: center;
    cursor: pointer;
    color: ${({ theme }) => theme.palette.secondary.contrastText};
    background: ${({ theme }) => theme.palette.secondary.main};
    margin: 6px 0;
    padding: 6px 1.5rem;
    border-width: 0;
    border-radius: ${({ theme }) => theme.borderRadius};
    transition: all 100ms ease-in-out;
    box-shadow: ${({ theme }) => theme.boxShadow};
    height: min-content;
    width: 100%;

    &:hover {
        filter: brightness(120%);
    }

    &:disabled {
        cursor: not-allowed;
        filter: brightness(40%);
    }

    ${({ $withIcon }) => ($withIcon ? iconStyle : noIconStyle)};

    svg {
        height: 1rem;
        width: 1rem;
    }
`

const iconStyle = css`
    gap: 1rem;
`

const noIconStyle = css`
    display: inline-block;
    text-align: center;
`
