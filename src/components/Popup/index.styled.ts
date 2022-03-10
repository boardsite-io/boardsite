import styled from "styled-components"

export const PopupCover = styled.button`
    z-index: var(--zIndexPopupBG);
    position: fixed;
    inset: -100vh -100vw;
    background: transparent;
    border: none;

    &:focus-visible {
        background: #00000033;
        outline-width: 4px;
    }
`
