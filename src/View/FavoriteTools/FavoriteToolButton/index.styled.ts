import styled from "styled-components"

export const FavToolWrapper = styled.div`
    position: relative;
`

export const FavToolOptions = styled.div`
    z-index: var(--zIndexFavoriteTools);
    position: fixed;
    bottom: 3rem;
    right: 50%;
    transform: translateX(50%);
    display: flex;
    border-radius: var(--border-radius);
    background-color: ${({ theme }) => theme.palette.primary.main};
    box-shadow: var(--toolbar-box-shadow);
`
