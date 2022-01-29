import { isConnected } from "api/session"
import { HorizontalRule } from "components"
import { FormattedMessage } from "language"
import React from "react"
import { BsInfoCircle, BsPeople } from "react-icons/bs"
import { CLOSE_MAIN_MENU, OPEN_ABOUT, OPEN_SHORTCUTS } from "redux/menu"
import { MainSubMenuState } from "redux/menu/index.types"
import { SET_SESSION_DIALOG } from "redux/session"
import { DialogState } from "redux/session/index.types"
import store from "redux/store"
import { isMobile } from "react-device-detect"
import { MainMenuWrap } from "../../index.styled"
import MenuItem from "../../MenuItem"

const onClickOnlineSession = () => {
    if (isConnected()) {
        store.dispatch(SET_SESSION_DIALOG(DialogState.ManageOnlineSession))
    } else {
        store.dispatch(SET_SESSION_DIALOG(DialogState.CreateOnlineSession))
    }
    store.dispatch(CLOSE_MAIN_MENU())
}
const onClickAbout = () => {
    store.dispatch(OPEN_ABOUT())
    store.dispatch(CLOSE_MAIN_MENU())
}
const onClickShortcuts = () => {
    store.dispatch(OPEN_SHORTCUTS())
    store.dispatch(CLOSE_MAIN_MENU())
}

const GeneralMenu = () => {
    return (
        <MainMenuWrap>
            <MenuItem
                isMainMenu
                text={<FormattedMessage id="Menu.General.File" />}
                expandMenu={MainSubMenuState.File}
            />
            <MenuItem
                isMainMenu
                text={<FormattedMessage id="Menu.General.Edit" />}
                expandMenu={MainSubMenuState.Edit}
            />
            <HorizontalRule />
            <MenuItem
                isMainMenu
                text={<FormattedMessage id="Menu.General.OnlineSession" />}
                icon={<BsPeople id="transitory-icon" />}
                onClick={onClickOnlineSession}
            />
            <HorizontalRule />
            <MenuItem
                isMainMenu
                text={<FormattedMessage id="Menu.General.Settings" />}
                expandMenu={MainSubMenuState.Settings}
            />
            <MenuItem
                isMainMenu
                text={<FormattedMessage id="Menu.General.About" />}
                icon={<BsInfoCircle id="transitory-icon" />}
                onClick={onClickAbout}
            />
            {!isMobile && (
                <MenuItem
                    isMainMenu
                    text={<FormattedMessage id="Menu.General.Shortcuts" />}
                    onClick={onClickShortcuts}
                />
            )}
        </MainMenuWrap>
    )
}
export default GeneralMenu
