import { FormattedMessage } from "language"
import React, { memo, useCallback } from "react"
import {
    IconButton,
    MenuIcon,
    Position,
    ToolTip,
    VerticalRule,
} from "components"
import { MainMenuState, MainSubMenuState } from "state/menu/state/index.types"
import { menu, useMenu } from "state/menu"
import { MainMenuBarWrap } from "./index.styled"
import ViewButton from "./ViewButton"
import PageButton from "./PageButton"
import SessionButton from "./SessionButton"

const onClickGeneral = () => {
    menu.setMainMenu(MainMenuState.General)
}
const onClickView = () => {
    menu.setMainMenu(MainMenuState.View)
}
const onClickPage = () => {
    menu.setMainMenu(MainMenuState.Page)
}
const onClickSession = () => {
    menu.setMainMenu(MainMenuState.Session)
}

const onEnter = (newState: MainMenuState, currentState: MainMenuState) => {
    if (currentState !== MainMenuState.Closed && currentState !== newState) {
        menu.setMainSubMenu(MainSubMenuState.Closed)
        menu.setMainMenu(newState)
    }
}

const MainMenuBar: React.FC = memo(() => {
    const { mainMenuState } = useMenu("mainMenu")

    const onMouseEnterGeneral = useCallback(() => {
        onEnter(MainMenuState.General, mainMenuState)
    }, [mainMenuState])
    const onMouseEnterView = useCallback(() => {
        onEnter(MainMenuState.View, mainMenuState)
    }, [mainMenuState])
    const onMouseEnterPage = useCallback(() => {
        onEnter(MainMenuState.Page, mainMenuState)
    }, [mainMenuState])
    const onMouseEnterSession = useCallback(() => {
        onEnter(MainMenuState.Session, mainMenuState)
    }, [mainMenuState])

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
            <VerticalRule />
            <ToolTip
                deactivate={mainMenuState !== MainMenuState.Closed}
                position={Position.BottomRight}
                text={<FormattedMessage id="Menu.Bar.Session.ToolTip" />}
            >
                <SessionButton
                    onClick={onClickSession}
                    onMouseEnter={onMouseEnterSession}
                />
            </ToolTip>
        </MainMenuBarWrap>
    )
})

export default MainMenuBar
