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
    border-radius: var(--border-radius);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.4rem 0.6rem;
    margin: 0.1rem;

    transition: all 200ms ease;
    color: var(--cMenuItems);
    background: var(--cMenuBackground);

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
