import React, { useState } from "react"
import { FormattedMessage } from "language"
import { ExpandableIcon, HorizontalRule } from "components"
import { FaGithub } from "react-icons/fa"
import { SiGithubsponsors } from "react-icons/si"
import { isMobile } from "react-device-detect"
import { online, useOnline } from "state/online"
import { menu } from "state/menu"
import { AUTH_URL } from "api/auth"
import { CSSTransition } from "react-transition-group"
import EditMenu from "View/MainMenu/menu/General/Edit"
import { cssTransition } from "View/MainMenu/cssTransition"
import { MainMenuWrap } from "../../index.styled"
import MenuItem from "../../MenuItem"
import FileMenu from "./File"
import SettingsMenu from "./Settings"

export const openInNewTab = (url: string): void => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer")
    if (newWindow) newWindow.opener = null
}

const onClickGithub = () => {
    openInNewTab("https://github.com/boardsite-io/boardsite")
}

const onClickSignIn = () => {
    window.location.href = AUTH_URL
}

const onClickSignOut = () => {
    online.clearToken()
}

const onClickShortcuts = () => {
    menu.openShortcuts()
    menu.closeMainMenu()
}

enum SubMenu {
    Closed,
    File,
    Edit,
    Settings,
}

const GeneralMenu = () => {
    const [subMenu, setSubMenu] = useState<SubMenu>(SubMenu.Closed)
    const { isSignedIn, isAuthorized } = useOnline()

    return (
        <MainMenuWrap>
            <MenuItem
                text={<FormattedMessage id="Menu.General.File" />}
                expandMenu={() => setSubMenu(SubMenu.File)}
                icon={<ExpandableIcon />}
            >
                <CSSTransition in={subMenu === SubMenu.File} {...cssTransition}>
                    <FileMenu />
                </CSSTransition>
            </MenuItem>
            <MenuItem
                text={<FormattedMessage id="Menu.General.Edit" />}
                expandMenu={() => setSubMenu(SubMenu.Edit)}
                icon={<ExpandableIcon />}
            >
                <CSSTransition in={subMenu === SubMenu.Edit} {...cssTransition}>
                    <EditMenu />
                </CSSTransition>
            </MenuItem>
            <HorizontalRule />
            <MenuItem
                text={<FormattedMessage id="Menu.General.Settings" />}
                expandMenu={() => setSubMenu(SubMenu.Settings)}
                icon={<ExpandableIcon />}
            >
                <CSSTransition
                    in={subMenu === SubMenu.Settings}
                    {...cssTransition}
                >
                    <SettingsMenu />
                </CSSTransition>
            </MenuItem>
            <MenuItem
                text={<FormattedMessage id="Menu.General.Github" />}
                icon={<FaGithub id="transitory-icon" />}
                onClick={onClickGithub}
            />
            {!isMobile && (
                <MenuItem
                    text={<FormattedMessage id="Menu.General.Shortcuts" />}
                    onClick={onClickShortcuts}
                />
            )}
            <HorizontalRule />
            {isAuthorized() && (
                <MenuItem
                    text={<FormattedMessage id="Menu.General.GithubSponsor" />}
                    icon={<SiGithubsponsors id="transitory-icon" />}
                />
            )}
            {!isSignedIn() ? (
                <MenuItem
                    text={<FormattedMessage id="Menu.General.SignIn" />}
                    onClick={onClickSignIn}
                />
            ) : (
                <MenuItem
                    text={<FormattedMessage id="Menu.General.SignOut" />}
                    onClick={onClickSignOut}
                />
            )}
        </MainMenuWrap>
    )
}
export default GeneralMenu
