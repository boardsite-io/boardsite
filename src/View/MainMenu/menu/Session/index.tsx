import { FormattedMessage } from "language"
import React, { useCallback, useState } from "react"
import { ExpandableIcon, HorizontalRule } from "components"
import { DialogState, MainMenuState } from "state/menu/state/index.types"
import { menu } from "state/menu"
import { useGState } from "state"
import { CSSTransition } from "react-transition-group"
import { cssTransition } from "View/MainMenu/cssTransition"
import { online } from "state/online"
import { User } from "state/online/state/index.types"
import { MainMenuWrap } from "View/MainMenu/index.styled"
import MenuItem from "View/MainMenu/MenuItem"
import SessionSettingsMenu from "./SessionSettings"
import UserOptions from "./UserOptions"
import { UserMenuItem } from "./index.styled"

enum SubMenu {
    Closed = "Closed",
    SessionSettings = "SessionSettings",
}

const SessionMenu = () => {
    const [subMenu, setSubMenu] = useState<SubMenu | User["id"]>(SubMenu.Closed)
    useGState("Session")

    const leaveSession = useCallback(() => {
        menu.setDialogState(DialogState.OnlineLeave)
        menu.setMainMenu(MainMenuState.Closed)
    }, [])

    const changePassword = useCallback(() => {
        menu.setDialogState(DialogState.OnlineChangePassword)
    }, [])

    const changeAlias = useCallback(() => {
        menu.setDialogState(DialogState.OnlineChangeAlias)
    }, [])

    if (!online.state.session.socket) {
        return null
    }

    return (
        <MainMenuWrap>
            {Object.values(online.state.session.users ?? {}).map((user) => {
                const userIsHost = user.id === online.state.session.config?.host
                const userIsYou = user.id === online.state.user.id

                return (
                    <UserMenuItem
                        color={user.color}
                        icon={<ExpandableIcon />}
                        key={user.id}
                        text={
                            <FormattedMessage
                                id="Menu.General.Session.UserAlias"
                                values={{
                                    isHostPrefix: userIsHost ? "👑 " : "",
                                    isYouPrefix: userIsYou ? "👉🏻 " : "",
                                    userAlias: user.alias,
                                }}
                            />
                        }
                        expandMenu={() => setSubMenu(user.id)}
                    >
                        <CSSTransition
                            in={subMenu === user.id}
                            {...cssTransition}
                        >
                            {user.id && (
                                <UserOptions
                                    userIsYou={userIsYou}
                                    isHost={online.isHost()}
                                    userId={user.id}
                                />
                            )}
                        </CSSTransition>
                    </UserMenuItem>
                )
            })}
            <HorizontalRule />
            {online.isHost() && online.isAuthorized() && (
                <>
                    <MenuItem
                        text={
                            <FormattedMessage id="Menu.General.Session.Settings" />
                        }
                        expandMenu={() => setSubMenu(SubMenu.SessionSettings)}
                        icon={<ExpandableIcon />}
                    >
                        <CSSTransition
                            in={subMenu === SubMenu.SessionSettings}
                            {...cssTransition}
                        >
                            <SessionSettingsMenu />
                        </CSSTransition>
                    </MenuItem>
                    <MenuItem
                        text={
                            <FormattedMessage id="Menu.General.Session.ChangePassword" />
                        }
                        onClick={changePassword}
                    />
                </>
            )}

            <MenuItem
                text={
                    <FormattedMessage id="Menu.General.Session.ChangeAlias" />
                }
                onClick={changeAlias}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.General.Session.Leave" />}
                onClick={leaveSession}
            />
        </MainMenuWrap>
    )
}

export default SessionMenu
