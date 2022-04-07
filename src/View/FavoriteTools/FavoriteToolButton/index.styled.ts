import styled from "styled-components"

export const FavToolWrapper = styled.div`
    position: relative;
`

export const FavToolOptions = styled.div`
    z-index: var(--zIndexFavoriteTools);
    position: absolute;
    display: flex;
    left: 100%;
    top: 0;
    margin-left: var(--toolbar-margin);
    border-radius: var(--border-radius);
    background-color: ${({ theme }) => theme.palette.primary.main};
    box-shadow: var(--toolbar-box-shadow);
`
