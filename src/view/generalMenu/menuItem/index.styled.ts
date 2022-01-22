import styled, { css } from "styled-components"

export const ItemWrap = styled.li`
    display: flex;
    align-items: center;
    width: 100%;

    svg {
        stroke: black;
        height: 1rem;
        width: 1rem;
    }
`

export const ItemButton = styled.button<{ $warning: boolean }>`
    gap: 0.5rem;
    border: none;
    border-radius: var(--menubar-border-radius);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.4rem 0.6rem;
    margin: 0.1rem;

    transition: all 200ms ease;

    background: var(--color1);
    &:hover {
        filter: brightness(80%);
    }

    ${({ $warning }) =>
        $warning
            ? css`
                  color: var(--colorWarning);
              `
            : css``};
`
