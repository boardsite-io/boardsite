import styled, { css } from "styled-components"

export const Item = styled.li`
    list-style: none;
    color: ${({ theme }) => theme.palette.primary.contrastText};
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    margin: 0;
    gap: 1rem;
`

export const Title = styled.span``
export const Keys = styled.span`
    ${({ theme }) => css`
        text-overflow: ellipsis;
        background: ${theme.palette.editor.selected};
        padding: ${theme.menuButton.padding};
        margin: ${theme.menuButton.margin};
        border-radius: ${theme.borderRadius};
    `}
`
