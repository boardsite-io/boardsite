import styled from "styled-components"
import MenuItem from "View/MainMenu/MenuItem"

export const UserMenuItem = styled(MenuItem)<{ color: string }>`
    border-left: 2px solid;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-color: ${({ color }) => color};
`
