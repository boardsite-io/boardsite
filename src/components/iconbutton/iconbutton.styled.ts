import styled, { css } from "styled-components"

interface Props {
    $deactivated?: boolean
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
    ${({ $background }) =>
        $background ? withBackground($background) : noBackground};

    /* color for non custom svgs */
    color: var(--color1);
    svg {
        transition: all 100ms ease-in-out;
        height: 80%;
        width: 80%;
    }

    ${({ $active }) => ($active ? active : inactive)};
    ${({ $deactivated }) => ($deactivated ? deactivated : null)};
`

const noBackground = css`
    background: none;
    box-shadow: none;
`
const withBackground = ($background: string) => css`
    background: ${$background};
    box-shadow: var(--box-shadow);
`

const active = css`
    background: var(--color8);
    box-shadow: inset 0 0 0.1rem 0 var(--color7), 0 0 0.5rem 0 var(--color7);
    svg {
        stroke: var(--color7);
    }
`
const inactive = css`
    &:hover {
        svg {
            transform: var(--button-hover-transform);
        }
    }
`
const deactivated = css`
    cursor: not-allowed;
    svg {
        stroke: var(--color2);
    }
`
