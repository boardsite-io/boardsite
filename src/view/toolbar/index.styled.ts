import styled from "styled-components"
import { ScreenSize } from "app/theme"

export const ToolbarStyled = styled.div`
    z-index: 100;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    gap: var(--button-gap);
    padding: var(--menu-padding);
    background: var(--color2);
    box-shadow: var(--menubar-box-shadow);

    /* blend out zoom buttons for small screens */
    @media (max-width: ${ScreenSize.Xs}) {
        .toolbar-zoom {
            display: none;
        }
    }
`
export const ToolbarGroup = styled.div`
    display: flex;
    gap: var(--button-gap);
`
