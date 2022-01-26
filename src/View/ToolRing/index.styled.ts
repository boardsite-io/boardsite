import { ScreenSize } from "app/theme"
import styled from "styled-components"

export const ToolRingWrap = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    margin-top: var(--toolbar-margin);
    margin-right: var(--toolbar-margin);

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    z-index: var(--zIndexToolRing);
    background: var(--cPrimary);
    gap: var(--toolbar-gap);
    padding: var(--toolbar-padding);
    border-radius: var(--toolbar-border-radius);
    box-shadow: var(--toolbar-box-shadow);

    @media (min-width: ${ScreenSize.Sm}) {
        margin-right: 0;
        right: 50%;
        transform: translateX(50%);
    }
`
