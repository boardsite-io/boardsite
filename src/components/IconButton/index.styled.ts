import styled, { css } from "styled-components"

interface Props {
    $deactivated?: boolean
    $active?: boolean
}

export const StyledIconButton = styled.button<Props>`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--icon-button-size);
    width: var(--icon-button-size);
    margin: var(--icon-button-margin);
    padding: var(--icon-button-padding);
    border: none;
    border-radius: var(--border-radius);
    background: ${({ theme }) => theme.palette.primary.main};

    /* color for non custom svgs */
    color: ${({ theme }) => theme.palette.primary.contrastText};
    svg {
        transition: all 100ms ease-in-out;
        height: 80%;
        width: 80%;
    }

    ${({ $active }) => ($active ? active : inactive)};
    ${({ $deactivated }) => ($deactivated ? deactivated : null)};
`

const active = css`
    background: ${({ theme }) => theme.palette.editor.selected};
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
        stroke: ${({ theme }) => theme.palette.primary.main};
    }
`
