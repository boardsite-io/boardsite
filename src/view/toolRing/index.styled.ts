import styled from "styled-components"

export const ToolRingWrap = styled.div`
    position: fixed;
    top: var(--toolbar-margin);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    z-index: var(--zIndexToolRing);
    background: var(--cMenuBackground);
    gap: var(--button-gap);
    padding: var(--toolbar-padding);
    border-radius: var(--toolbar-border-radius);
    box-shadow: var(--toolbar-box-shadow);
`
