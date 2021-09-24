import styled, { css } from "styled-components"

interface Props {
    $active?: boolean
    $background?: string
}

export const StyledIconButton = styled.button<Props>`
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--icon-button-size);
    width: var(--icon-button-size);
    padding: 0;
    outline: none;
    border: none;
    border-radius: var(--button-border-radius);
    color: ${({ $active }) => ($active ? "var(--color7)" : "var(--color1)")};
    ${({ $background }) =>
        $background ? withBackgroundStyle($background) : noBackgroundStyle};
    &:hover {
        color: var(--color2);
        background: var(--color1);
        svg {
            /* For custom icons */
            stroke: var(--color8);
            /* For non custom icons */
            color: var(--color8);
        }
    }
    svg {
        height: 80%;
        width: 80%;
    }
`

const noBackgroundStyle = css`
    background: none;
`

const withBackgroundStyle = ($background: string) => css`
    background: ${$background};
    box-shadow: var(--box-shadow);
`
