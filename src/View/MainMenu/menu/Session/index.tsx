import { FormattedMessage } from "language"
import React, { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { BoardSession } from "api/session"
import { ExpandableIcon, HorizontalRule } from "components"
import { User } from "api/types"
import { online, useOnline } from "state/online"
import { notification } from "state/notification"
import { CSSTransition } from "react-transition-group"
import { cssTransition } from "View/MainMenu/cssTransition"
import { MainMenuWrap } from "../../index.styled"
import MenuItem from "../../MenuItem"
import SessionSettingsMenu from "./SessionSettings"
import UserOptions from "./UserOptions"

enum SubMenu {
    Closed = "Closed",
    SessionSettings = "SessionSettings",
}

const SessionMenu = () => {
    const [subMenu, setSubMenu] = useState<SubMenu | User["id"]>(SubMenu.Closed)
    const navigate = useNavigate()
    const { session } = useOnline()

    const createAndJoin = useCallback(
        (copyOffline: boolean) => async () => {
            try {
                const session = new BoardSession(online.state.userSelection)
                const sessionId = await session.create()
                await session.createSocket(sessionId)
                await session.join(copyOffline)
                online.newSession(session)
                navigate(BoardSession.path(sessionId))
            } catch (error) {
                notification.create("Notification.SessionCreationFailed", 2000)
            }
        },
        [navigate]
    )

    const leaveSession = useCallback(() => {
        session?.disconnect()
        navigate("/")
    }, [session, navigate])

    if (!session?.isConnected()) {
        return (
            <MainMenuWrap>
                <MenuItem
                    text={<FormattedMessage id="Menu.General.Session.New" />}
                    onClick={createAndJoin(false)}
                />
                <MenuItem
                    text={
                        <FormattedMessage id="Menu.General.Session.NewFromCurrent" />
                    }
                    onClick={createAndJoin(true)}
                />
            </MainMenuWrap>
        )
    }

    const isHost = session.isHost()

    return (
        <MainMenuWrap>
            {Object.values(session.users ?? {}).map((user) => {
                const userIsHost = user.id === session.config?.host
                const userIsYou = user.id === session.user.id

                return (
                    <MenuItem
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
                                    isHost={isHost}
                                    userId={user.id}
                                />
                            )}
                        </CSSTransition>
                    </MenuItem>
                )
            })}
            <HorizontalRule />
            {isHost && (
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
            )}
            <MenuItem
                text={<FormattedMessage id="Menu.General.Session.Leave" />}
                onClick={leaveSession}
            />
        </MainMenuWrap>
    )
}

export default SessionMenu
