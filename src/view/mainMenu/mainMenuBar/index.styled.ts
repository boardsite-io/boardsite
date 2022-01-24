import styled from "styled-components"

export const MainMenuBarWrap = styled.div`
    z-index: var(--zIndexMainMenu);
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    top: var(--toolbar-margin);
    left: var(--toolbar-margin);
    background: var(--cMenuBackground);
    border-radius: var(--toolbar-border-radius);
    box-shadow: var(--toolbar-box-shadow);
    padding: var(--toolbar-padding);
`
