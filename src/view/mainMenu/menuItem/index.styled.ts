import styled, { css } from "styled-components"

export const ItemWrap = styled.li`
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
    color: var(--cSecondary);
    background: var(--cPrimary);

    &:hover {
        filter: brightness(80%);
    }

    ${({ $warning }) =>
        $warning
            ? css`
                  color: var(--cWarning);
              `
            : css``};
`
