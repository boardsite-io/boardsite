import { FormattedMessage } from "language"
import React, { useState } from "react"
import { NavigateFunction, useNavigate } from "react-router-dom"
import { BoardSession, currentSession, isConnected } from "api/session"
import { ExpandableIcon, HorizontalRule } from "components"
import { Session, User } from "api/types"
import { useOnline } from "state/online"
import { notification } from "state/notification"
import { CSSTransition } from "react-transition-group"
import { cssTransition } from "View/MainMenu/cssTransition"
import { MainMenuWrap } from "../../index.styled"
import MenuItem from "../../MenuItem"
import SessionSettingsMenu from "./SessionSettings"

const createAndJoin =
    (navigate: NavigateFunction, copyOffline?: boolean) => async () => {
        try {
            const sessionId = await currentSession().create()
            await currentSession().createSocket(sessionId)
            await currentSession().join(copyOffline)
            navigate(BoardSession.path(sessionId))
        } catch (error) {
            notification.create("Notification.SessionCreationFailed", 2000)
        }
    }

const leaveSession = (navigate: NavigateFunction) => () => {
    currentSession().disconnect()
    navigate("/")
}

const getUserName = (session: Session | undefined, user: User) => {
    let name = user.alias
    if (user.id === session?.config?.host) {
        name += " (Host)"
    }
    if (user.id === session?.user.id) {
        name += " (👈 You)"
    }
    return name
}

enum SubMenu {
    Closed,
    SessionSettings,
}

const SessionMenu = () => {
    const [subMenu, setSubMenu] = useState<SubMenu>(SubMenu.Closed)
    const navigate = useNavigate()
    const { session } = useOnline()

    return (
        <MainMenuWrap>
            {!isConnected() ? (
                <>
                    <MenuItem
                        text={
                            <FormattedMessage id="Menu.General.Session.New" />
                        }
                        onClick={createAndJoin(navigate, false)}
                    />
                    <MenuItem
                        text={
                            <FormattedMessage id="Menu.General.Session.NewFromCurrent" />
                        }
                        onClick={createAndJoin(navigate, true)}
                    />
                </>
            ) : (
                <>
                    {Object.values(session?.users ?? {}).map((user) => (
                        <MenuItem
                            key={user.id}
                            text={getUserName(session, user)}
                        />
                    ))}
                    <HorizontalRule />
                    {session?.isHost() && (
                        <MenuItem
                            text={
                                <FormattedMessage id="Menu.General.Session.Settings" />
                            }
                            expandMenu={() =>
                                setSubMenu(SubMenu.SessionSettings)
                            }
                            icon={<ExpandableIcon />}
                        >
                            <CSSTransition
                                in={subMenu === SubMenu.SessionSettings}
                                {...cssTransition}
                            >
                                <SessionSettingsMenu />
                            </CSSTransition>
                        </MenuItem>
                    )}
                    <MenuItem
                        text={
                            <FormattedMessage id="Menu.General.Session.Leave" />
                        }
                        onClick={leaveSession(navigate)}
                    />
                </>
            )}
        </MainMenuWrap>
    )
}

export default SessionMenu
