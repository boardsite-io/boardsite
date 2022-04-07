import styled from "styled-components"

export const PopupCover = styled.button`
    z-index: var(--zIndexPopupBG);
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    background: transparent;
    border: none;

    &:focus-visible {
        background: #00000033;
        outline-width: 4px;
    }
`
