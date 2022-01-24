import styled from "styled-components"

export const FavToolsStyled = styled.div`
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: var(--toolbar-margin);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    z-index: var(--zIndexFavoriteTools);
    background: var(--cMenuBackground);
    gap: var(--button-gap);
    padding: var(--toolbar-padding);
    border-radius: var(--toolbar-border-radius);
    box-shadow: var(--toolbar-box-shadow);
`
