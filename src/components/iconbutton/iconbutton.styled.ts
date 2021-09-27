import styled, { css } from "styled-components"

interface Props {
    $active?: boolean
    $background?: string
}

export const StyledIconButton = styled.button<Props>`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--icon-button-size);
    width: var(--icon-button-size);
    margin: 0.1rem;
    padding: 0;
    outline: none;
    border: none;
    border-radius: var(--button-border-radius);
    color: ${({ $active }) => ($active ? "var(--color7)" : "var(--color1)")};
    ${({ $background }) =>
        $background ? withBackgroundStyle($background) : noBackgroundStyle};

    svg {
        transition: all 100ms ease-in-out;
        height: 80%;
        width: 80%;
    }
    &:hover {
        svg {
            height: 100%;
            width: 100%;
        }
    }
`

const noBackgroundStyle = css`
    background: none;
`

const withBackgroundStyle = ($background: string) => css`
    background: ${$background};
    box-shadow: var(--box-shadow);
`
