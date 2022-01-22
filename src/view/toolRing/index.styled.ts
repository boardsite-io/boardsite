import styled from "styled-components"

export const ToolRingWrap = styled.div`
    z-index: 100;
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: space-between;
    gap: var(--button-gap);
    padding: var(--menu-padding);
    background: var(--color2);
    border-bottom-left-radius: var(--menubar-border-radius);
    border-bottom-right-radius: var(--menubar-border-radius);
    box-shadow: var(--menubar-box-shadow);
`
