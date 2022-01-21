import { FormattedMessage } from "language"
import React, { memo } from "react"
import store from "redux/store"
import { Divider, ExpandableIcon } from "components"
import { BsGear, BsPeople } from "react-icons/bs"
import { useCustomSelector } from "hooks"
import { CSSTransition } from "react-transition-group"
import {
    CLOSE_GENERAL_MENU,
    GeneralMenuState,
    OPEN_SETTINGS,
} from "redux/menu/menu"
import { SET_SESSION_DIALOG } from "redux/session/session"
import { DialogState } from "redux/session/session.types"
import { isConnected } from "api/session"
import {
    GeneralMenuDropdown,
    GeneralMenuBackground,
    MainMenu,
} from "./index.styled"
import MenuItem from "./menuItem"
import FileMenu from "./fileMenu"
import ViewMenu from "./viewMenu"
import PageMenu from "./pageMenu"
import EditMenu from "./editMenu"

const onClickBackground = () => {
    store.dispatch(CLOSE_GENERAL_MENU())
}
const onClickSettings = () => {
    store.dispatch(OPEN_SETTINGS())
    store.dispatch(CLOSE_GENERAL_MENU())
}
const onClickOnlineSession = () => {
    if (isConnected()) {
        store.dispatch(SET_SESSION_DIALOG(DialogState.ManageOnlineSession))
    } else {
        store.dispatch(SET_SESSION_DIALOG(DialogState.CreateOnlineSession))
    }
    store.dispatch(CLOSE_GENERAL_MENU())
}

const cssTransitionProps = {
    unmountOnExit: true,
    timeout: 500,
    classNames: "menu",
}

const GeneralMenu: React.FC = memo(() => {
    const menuOpen = useCustomSelector((state) => state.menu.generalMenuOpen)
    const menuState = useCustomSelector((state) => state.menu.generalMenuState)

    return (
        <>
            <GeneralMenuBackground
                open={menuOpen}
                onClick={onClickBackground}
            />
            <GeneralMenuDropdown open={menuOpen}>
                <MainMenu>
                    <MenuItem
                        isMainMenu
                        text={<FormattedMessage id="GeneralMenu.File" />}
                        icon={<ExpandableIcon />}
                        expandMenu={GeneralMenuState.File}
                    />
                    <MenuItem
                        isMainMenu
                        text={<FormattedMessage id="GeneralMenu.Edit" />}
                        icon={<ExpandableIcon />}
                        expandMenu={GeneralMenuState.Edit}
                    />
                    <MenuItem
                        isMainMenu
                        text={<FormattedMessage id="GeneralMenu.Page" />}
                        icon={<ExpandableIcon />}
                        expandMenu={GeneralMenuState.Page}
                    />
                    <MenuItem
                        isMainMenu
                        text={<FormattedMessage id="GeneralMenu.View" />}
                        icon={<ExpandableIcon />}
                        expandMenu={GeneralMenuState.View}
                    />
                    <Divider />
                    <MenuItem
                        isMainMenu
                        text={
                            <FormattedMessage id="GeneralMenu.OnlineSession" />
                        }
                        icon={<BsPeople id="transitory-icon" />}
                        onClick={onClickOnlineSession}
                    />
                    <Divider />
                    <MenuItem
                        isMainMenu
                        text={<FormattedMessage id="GeneralMenu.Settings" />}
                        icon={<BsGear id="transitory-icon" />}
                        onClick={onClickSettings}
                    />
                </MainMenu>
                <CSSTransition
                    in={menuState === GeneralMenuState.File}
                    {...cssTransitionProps}
                >
                    <FileMenu />
                </CSSTransition>
                <CSSTransition
                    in={menuState === GeneralMenuState.Edit}
                    {...cssTransitionProps}
                >
                    <EditMenu />
                </CSSTransition>
                <CSSTransition
                    in={menuState === GeneralMenuState.Page}
                    {...cssTransitionProps}
                >
                    <PageMenu />
                </CSSTransition>
                <CSSTransition
                    in={menuState === GeneralMenuState.View}
                    {...cssTransitionProps}
                >
                    <ViewMenu />
                </CSSTransition>
            </GeneralMenuDropdown>
        </>
    )
})

export default GeneralMenu
