import { FormattedMessage } from "language"
import React, { memo } from "react"
import store from "redux/store"
import {
    IconButton,
    MenuIcon,
    Position,
    ToolTip,
    VerticalRule,
} from "components"
import {
    SET_MAIN_MENU,
    MainMenuState,
    SET_MAIN_SUB_MENU,
    MainSubMenuState,
} from "redux/menu/menu"
import { useCustomSelector } from "hooks"
import { MainMenuBarWrap } from "./index.styled"
import ViewButton from "./viewButton"
import PageButton from "./pageButton"

const onClickGeneral = () => {
    store.dispatch(SET_MAIN_MENU(MainMenuState.General))
}
const onClickView = () => {
    store.dispatch(SET_MAIN_MENU(MainMenuState.View))
}
const onClickPage = () => {
    store.dispatch(SET_MAIN_MENU(MainMenuState.Page))
}

const onEnter = (newState: MainMenuState, currentState: MainMenuState) => {
    if (currentState !== MainMenuState.Closed && currentState !== newState) {
        store.dispatch(SET_MAIN_SUB_MENU(MainSubMenuState.Closed))
        store.dispatch(SET_MAIN_MENU(newState))
    }
}

const MainMenuBar: React.FC = memo(() => {
    const mainMenuState = useCustomSelector((state) => state.menu.mainMenuState)

    const onMouseEnterGeneral = () => {
        onEnter(MainMenuState.General, mainMenuState)
    }
    const onMouseEnterView = () => {
        onEnter(MainMenuState.View, mainMenuState)
    }
    const onMouseEnterPage = () => {
        onEnter(MainMenuState.Page, mainMenuState)
    }

    return (
        <MainMenuBarWrap>
            <ToolTip
                deactivate={mainMenuState !== MainMenuState.Closed}
                position={Position.BottomRight}
                text={<FormattedMessage id="Menu.Bar.General.ToolTip" />}
            >
                <IconButton
                    icon={<MenuIcon />}
                    onClick={onClickGeneral}
                    onMouseEnter={onMouseEnterGeneral}
                />
            </ToolTip>
            <VerticalRule />
            <ToolTip
                deactivate={mainMenuState !== MainMenuState.Closed}
                position={Position.BottomRight}
                text={<FormattedMessage id="Menu.Bar.Page.ToolTip" />}
            >
                <PageButton
                    onClick={onClickPage}
                    onMouseEnter={onMouseEnterPage}
                />
            </ToolTip>
            <VerticalRule />
            <ToolTip
                deactivate={mainMenuState !== MainMenuState.Closed}
                position={Position.BottomRight}
                text={<FormattedMessage id="Menu.Bar.View.ToolTip" />}
            >
                <ViewButton
                    onClick={onClickView}
                    onMouseEnter={onMouseEnterView}
                />
            </ToolTip>
        </MainMenuBarWrap>
    )
})

export default MainMenuBar
