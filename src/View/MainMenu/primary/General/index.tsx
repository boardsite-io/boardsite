import React from "react"
import { FormattedMessage } from "language"
import { HorizontalRule } from "components"
import { isConnected } from "api/session"
import { BsPeople } from "react-icons/bs"
import { FaGithub } from "react-icons/fa"
import { SiGithubsponsors } from "react-icons/si"
import { isMobile } from "react-device-detect"
import { online, useOnline } from "state/online"
import { DialogState } from "state/online/state/index.types"
import { menu } from "state/menu"
import { AUTH_URL } from "api/auth"
import { MainSubMenuState } from "state/menu/state/index.types"
import { MainMenuWrap } from "../../index.styled"
import MenuItem from "../../MenuItem"

export const openInNewTab = (url: string): void => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer")
    if (newWindow) newWindow.opener = null
}

const onClickOnlineSession = () => {
    if (isConnected()) {
        online.setSessionDialog(DialogState.ManageOnlineSession)
    } else {
        online.setSessionDialog(DialogState.CreateOnlineSession)
    }
    menu.closeMainMenu()
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

const GeneralMenu = () => {
    const { isSignedIn, isAuthorized } = useOnline()
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
                text={<FormattedMessage id="Menu.General.Github" />}
                icon={<FaGithub id="transitory-icon" />}
                onClick={onClickGithub}
            />
            {!isMobile && (
                <MenuItem
                    isMainMenu
                    text={<FormattedMessage id="Menu.General.Shortcuts" />}
                    onClick={onClickShortcuts}
                />
            )}
            <HorizontalRule />
            {isAuthorized() && (
                <MenuItem
                    isMainMenu
                    text={<FormattedMessage id="Menu.General.GithubSponsor" />}
                    icon={<SiGithubsponsors id="transitory-icon" />}
                />
            )}
            {!isSignedIn() ? (
                <MenuItem
                    isMainMenu
                    text={<FormattedMessage id="Menu.General.SignIn" />}
                    onClick={onClickSignIn}
                />
            ) : (
                <MenuItem
                    isMainMenu
                    text={<FormattedMessage id="Menu.General.SignOut" />}
                    onClick={onClickSignOut}
                />
            )}
        </MainMenuWrap>
    )
}
export default GeneralMenu
