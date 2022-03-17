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
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: space-between;
    gap: var(--main-menu-button-gap);
    padding: var(--main-menu-button-padding);
    margin: var(--main-menu-button-margin);
    border: none;
    border-radius: var(--border-radius);
    transition: all 200ms ease;
    color: ${({ theme }) => theme.palette.primary.contrastText};
    background: ${({ theme }) => theme.palette.primary.main};

    &:hover {
        filter: var(--main-menu-hover-filter);
    }

    &:disabled {
        cursor: no-drop;
        filter: opacity(20%);
    }

    ${({ $warning }) =>
        $warning &&
        css`
            color: ${({ theme }) => theme.palette.common.warning};
        `}
`
