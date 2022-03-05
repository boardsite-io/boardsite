import { FormattedMessage } from "language"
import React from "react"
import { NavigateFunction, useNavigate } from "react-router-dom"
import { BoardSession } from "api/session"
import { HorizontalRule } from "components"
import { Session, User } from "api/types"
import { useOnline, online } from "state/online"
import { MainSubMenuState } from "state/menu/state/index.types"
import { SubMenuWrap } from "../../index.styled"
import MenuItem from "../../MenuItem"

const createAndJoin =
    (navigate: NavigateFunction, copyOffline?: boolean) => async () => {
        const session = new BoardSession(online.state.userSelection)
        const sessionId = await session.create()
        await session.createSocket(sessionId)
        await session.join(copyOffline)
        online.newSession(session)
        navigate(BoardSession.path(sessionId))
    }

const leaveSession =
    (session: Session | undefined, navigate: NavigateFunction) => () => {
        session?.disconnect()
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
            {!session?.isConnected() ? (
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
                            onClick={leaveSession(session, navigate)}
                        />
                    )}
                    <MenuItem
                        isMainMenu
                        text={
                            <FormattedMessage id="Menu.General.Session.Leave" />
                        }
                        onClick={leaveSession(session, navigate)}
                    />
                </>
            )}
        </SubMenuWrap>
    )
}

export default SessionMenu
