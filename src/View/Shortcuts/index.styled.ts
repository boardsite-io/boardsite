import { ScreenSize } from "App/theme"
import { Drawer } from "components"
import styled from "styled-components"

export const ShortcutDrawer = styled(Drawer)`
    width: fit-content;
    max-width: 80vw;
`
export const ShortcutList = styled.ul`
    display: grid;

    margin: 0;
    padding: 0.5rem 0.8rem;
    gap: 0.2rem 3em;

    @media (min-width: ${ScreenSize.Sm}) {
        grid-auto-flow: row;
        justify-content: space-between;
        align-items: center;
        grid-template-columns: repeat(2, 1fr);
    }
`
