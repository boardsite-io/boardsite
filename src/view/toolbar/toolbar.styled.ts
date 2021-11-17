import styled from "styled-components"
import { ScreenSize } from "theme.styled"

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

    /* Move undo/redo below toolbar for very small screens */
    @media (max-width: ${ScreenSize.Xs}) {
        .toolbar-undo {
            background: var(--color2);
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 3rem;
            left: 0;
            border-top-right-radius: var(--menubar-border-radius);
            border-bottom-right-radius: var(--menubar-border-radius);
            box-shadow: var(--menubar-box-shadow);
            padding: var(--menu-padding);
        }
    }

    /* blend out zoom buttons for small screens */
    @media (max-width: ${ScreenSize.Sm}) {
        .toolbar-zoom {
            display: none;
        }
    }
`
export const ToolbarGroup = styled.div`
    display: flex;
    gap: var(--button-gap);
`
