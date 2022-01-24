import { FormattedMessage } from "language"
import React, { memo } from "react"
import store from "redux/store"
import { IconButton, MenuIcon, Position, ToolTip } from "components"
import { SET_MAIN_MENU, MainMenuState } from "redux/menu/menu"
import { MainMenuBarWrap } from "./index.styled"
import ViewButton from "./viewButton"

const openGeneralMenu = () => {
    store.dispatch(SET_MAIN_MENU(MainMenuState.General))
}
const openViewMenu = () => {
    store.dispatch(SET_MAIN_MENU(MainMenuState.View))
}

const MainMenuBar: React.FC = memo(() => {
    return (
        <MainMenuBarWrap>
            <ToolTip
                position={Position.BottomRight}
                text={<FormattedMessage id="Menu.General.ToolTip" />}
            >
                <IconButton
                    icon={<MenuIcon />}
                    onClick={openGeneralMenu}
                    // onMouseEnter={openGeneralMenu}
                />
            </ToolTip>
            <ToolTip
                position={Position.BottomRight}
                text={<FormattedMessage id="Menu.View.ToolTip" />}
            >
                <ViewButton
                    onClick={openViewMenu}
                    // onMouseEnter={openViewMenu}
                />
            </ToolTip>
        </MainMenuBarWrap>
    )
})

export default MainMenuBar
