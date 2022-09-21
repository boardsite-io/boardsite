import styled, { css } from "styled-components"

// Ellipsis (...) text overflow for UserNames
export const TextWrap = styled.span`
    max-width: 11.3rem;
    display: inline-block;
    text-align: start;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`

export const ItemWrap = styled.li`
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 100%;
    list-style: none;
    svg {
        stroke: black;
        height: 1rem;
        width: 1rem;
    }
`

export const ItemButton = styled.button<{ $warning: boolean }>`
    ${({ theme, $warning }) => css`
        cursor: pointer;
        display: flex;
        flex-grow: 1;
        align-items: center;
        justify-content: space-between;
        gap: ${theme.menuButton.gap};
        padding: ${theme.menuButton.padding};
        margin: ${theme.menuButton.margin};
        border: none;
        border-radius: ${theme.borderRadius};
        transition: all 200ms ease;
        color: ${theme.palette.primary.contrastText};
        background: ${theme.palette.primary.main};

        &:hover {
            filter: ${theme.menuButton.hoverFilter};
        }

        &:disabled {
            cursor: no-drop;
            filter: opacity(20%);
        }

        ${$warning &&
        css`
            color: ${theme.palette.common.warning};
        `}
    `}
`
