import styled, { css } from "styled-components"

export const FavToolWrapper = styled.div`
    position: relative;
`

export const FavToolOptions = styled.div`
    ${({ theme }) => css`
        z-index: ${theme.zIndex.favoriteTools};
        position: absolute;
        display: flex;
        left: 100%;
        top: 0;
        margin-left: ${theme.toolbar.margin};
        border-radius: ${theme.borderRadius};
        background-color: ${theme.palette.primary.main};
        box-shadow: ${theme.toolbar.boxShadow};
    `}
`
