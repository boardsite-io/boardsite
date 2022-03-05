import { FormattedMessage } from "language"
import React from "react"
import { NavigateFunction, useNavigate } from "react-router-dom"
import { BoardSession, currentSession, isConnected } from "api/session"
import { HorizontalRule } from "components"
import { Session, User } from "api/types"
import { useOnline } from "state/online"
import { notification } from "state/notification"
import { SubMenuWrap } from "../../index.styled"
import MenuItem from "../../MenuItem"
import { MainSubMenuState } from "../../../../state/menu/state/index.types"

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

const userName = (session: Session | undefined, user: User) => {
    let name = user.alias
    if (user.id === session?.config?.host) {
        name += " (Host)"
    }
    if (user.id === session?.user.id) {
        name += " (👈 You)"
    }
    return name
}

const SessionMenu = () => {
    const navigate = useNavigate()
    const { session } = useOnline()

    return (
        <SubMenuWrap>
            {!isConnected() ? (
                <>
                    <MenuItem
                        isMainMenu
                        text={
                            <FormattedMessage id="Menu.General.Session.New" />
                        }
                        onClick={createAndJoin(navigate, false)}
                    />
                    <MenuItem
                        isMainMenu
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
                            isMainMenu
                            key={user.id}
                            text={userName(session, user)}
                        />
                    ))}
                    <HorizontalRule />
                    {session?.isHost() && (
                        <MenuItem
                            isMainMenu
                            text={
                                <FormattedMessage id="Menu.General.Session.Settings" />
                            }
                            expandMenu={MainSubMenuState.SessionSettings}
                            onClick={leaveSession(navigate)}
                        />
                    )}
                    <MenuItem
                        isMainMenu
                        text={
                            <FormattedMessage id="Menu.General.Session.Leave" />
                        }
                        onClick={leaveSession(navigate)}
                    />
                </>
            )}
        </SubMenuWrap>
    )
}

export default SessionMenu
