import styled, { css } from "styled-components"

export const FavToolsStyled = styled.div`
    ${({ theme }) => css`
        z-index: ${theme.zIndex.favoriteTools};
        position: fixed;
        display: flex;
        flex-direction: column;
        left: 0;
        bottom: 0;
        background: ${theme.palette.primary.main};
        margin: ${theme.toolbar.margin};
        gap: ${theme.toolbar.gap};
        padding: ${theme.toolbar.padding};
        box-shadow: ${theme.toolbar.boxShadow};
        border-radius: ${theme.borderRadius};
    `}
`
