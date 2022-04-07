import styled from "styled-components"

export const ToolRingWrap = styled.div`
    position: fixed;
    display: flex;
    flex-direction: column;
    top: 0;
    right: 0;
    margin: var(--toolbar-margin);
    z-index: var(--zIndexToolRing);
    background: ${({ theme }) => theme.palette.primary.main};
    gap: var(--toolbar-gap);
    padding: var(--toolbar-padding);
    border-radius: var(--border-radius);
    box-shadow: var(--toolbar-box-shadow);
`
