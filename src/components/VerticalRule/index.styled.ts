import styled, { css } from "styled-components"

export const VerticalRule = styled.div`
    ${({ theme }) => css`
        background: ${theme.palette.common.rule};
        outline: none;
        border: none;
        height: ${theme.iconButton.size};
        width: 1px;
        margin: 0;
        padding: 0;
    `}
`
