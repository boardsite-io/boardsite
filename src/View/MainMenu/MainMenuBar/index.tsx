import { FormattedMessage } from "language"
import React, { memo, useCallback } from "react"
import { Position, ToolTip, VerticalRule } from "components"
import { DialogState, MainMenuState } from "state/menu/state/index.types"
import { menu } from "state/menu"
import { online } from "state/online"
import { useGState } from "state"
import { MainMenuBarWrap } from "./index.styled"
import ViewButton from "./ViewButton"
import PageButton from "./PageButton"
import SessionButton from "./SessionButton"
import MenuButton from "./MenuButton"

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
    const numberOfUsers = online.getState().session?.getNumberOfUsers()

    if (numberOfUsers && numberOfUsers > 0) {
        menu.setMainMenu(MainMenuState.Session)
    } else {
        menu.setSessionDialog(DialogState.CreateOnlineSession)
    }
}

const onEnter = (newState: MainMenuState, currentState: MainMenuState) => {
    if (currentState !== MainMenuState.Closed && currentState !== newState) {
        menu.setMainMenu(newState)
    }
}

const MainMenuBar: React.FC = memo(() => {
    const { mainMenuState } = useGState("MainMenu").menu

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
        const numberOfUsers = online.getState().session?.getNumberOfUsers()
        if (numberOfUsers && numberOfUsers > 0) {
            onEnter(MainMenuState.Session, mainMenuState)
        }
    }, [mainMenuState])

    return (
        <MainMenuBarWrap>
            <ToolTip
                deactivate={mainMenuState !== MainMenuState.Closed}
                position={Position.BottomRight}
                text={<FormattedMessage id="ToolTip.Menu.Bar.General" />}
            >
                <MenuButton
                    onClick={onClickGeneral}
                    onMouseEnter={onMouseEnterGeneral}
                />
            </ToolTip>
            <VerticalRule />
            <ToolTip
                deactivate={mainMenuState !== MainMenuState.Closed}
                position={Position.BottomRight}
                text={<FormattedMessage id="ToolTip.Menu.Bar.Page" />}
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
                text={<FormattedMessage id="ToolTip.Menu.Bar.View" />}
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
                text={<FormattedMessage id="ToolTip.Menu.Bar.Session" />}
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
