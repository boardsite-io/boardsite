import { isConnected } from "api/session"
import { Divider, ExpandableIcon } from "components"
import { FormattedMessage } from "language"
import React from "react"
import { BsGear, BsInfoCircle, BsPeople } from "react-icons/bs"
import {
    CLOSE_MAIN_MENU,
    MainSubMenuState,
    OPEN_ABOUT,
    OPEN_SETTINGS,
} from "redux/menu/menu"
import { SET_SESSION_DIALOG } from "redux/session/session"
import { DialogState } from "redux/session/session.types"
import store from "redux/store"
import { MainMenuWrap } from "../index.styled"
import MenuItem from "../menuItem"

const onClickSettings = () => {
    store.dispatch(OPEN_SETTINGS())
    store.dispatch(CLOSE_MAIN_MENU())
}
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
                icon={<ExpandableIcon />}
                expandMenu={MainSubMenuState.File}
            />
            <MenuItem
                isMainMenu
                text={<FormattedMessage id="Menu.General.Edit" />}
                icon={<ExpandableIcon />}
                expandMenu={MainSubMenuState.Edit}
            />
            <MenuItem
                isMainMenu
                text={<FormattedMessage id="Menu.General.Page" />}
                icon={<ExpandableIcon />}
                expandMenu={MainSubMenuState.Page}
            />
            <Divider />
            <MenuItem
                isMainMenu
                text={<FormattedMessage id="Menu.General.OnlineSession" />}
                icon={<BsPeople id="transitory-icon" />}
                onClick={onClickOnlineSession}
            />
            <Divider />
            <MenuItem
                isMainMenu
                text={<FormattedMessage id="Menu.General.Settings" />}
                icon={<BsGear id="transitory-icon" />}
                onClick={onClickSettings}
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
