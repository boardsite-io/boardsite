import { isConnected } from "api/session"
import { HorizontalRule, ExpandableIcon } from "components"
import { FormattedMessage } from "language"
import React from "react"
import { BsInfoCircle, BsPeople } from "react-icons/bs"
import { CLOSE_MAIN_MENU, MainSubMenuState, OPEN_ABOUT } from "redux/menu/menu"
import { SET_SESSION_DIALOG } from "redux/session/session"
import { DialogState } from "redux/session/session.types"
import store from "redux/store"
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
        </MainMenuWrap>
    )
}
export default GeneralMenu
