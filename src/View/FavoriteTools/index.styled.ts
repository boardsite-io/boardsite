import styled from "styled-components"

export const FavToolsStyled = styled.div`
    z-index: var(--zIndexFavoriteTools);
    position: fixed;
    display: flex;
    flex-direction: column;
    left: 0;
    bottom: 0;
    background: ${({ theme }) => theme.palette.primary.main};
    margin: var(--toolbar-margin);
    gap: var(--toolbar-gap);
    padding: var(--toolbar-padding);
    border-radius: var(--border-radius);
    box-shadow: var(--toolbar-box-shadow);
`
