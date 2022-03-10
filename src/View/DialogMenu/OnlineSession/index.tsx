import React, { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { FormattedMessage } from "language"
import { Button, DialogContent, DialogTitle } from "components"
import { SESSION_ID_LENGTH } from "consts"
import { notification } from "state/notification"
import SessionIdInput from "./SessionIdInput"
import { CreateSessionOptions } from "./index.styled"
import { UserSelection } from "./UserSelection"
import { createOnlineSession, joinOnlineSession } from "./helpers"

const OnlineSession: React.FC = () => {
    const navigate = useNavigate()

    const onSubmitCreate = useCallback(
        (e: React.ChangeEvent<HTMLFormElement>) => {
            e.preventDefault()
            createOnlineSession(false, navigate)
        },
        [navigate]
    )

    const createFromCurrent = useCallback(() => {
        createOnlineSession(true, navigate)
    }, [navigate])

    const onSubmitJoin = useCallback(
        (e: React.ChangeEvent<HTMLFormElement>) => {
            e.preventDefault()
            const sessionId = (e.target[0] as HTMLInputElement).value

            if (sessionId.length === SESSION_ID_LENGTH) {
                joinOnlineSession(sessionId, navigate)
            } else {
                notification.create("Notification.Session.InvalidSessionId")
            }
        },
        [navigate]
    )

    return (
        <>
            <DialogTitle>
                <FormattedMessage id="DialogMenu.CreateOnline.Title" />
            </DialogTitle>
            <DialogContent>
                <form onSubmit={onSubmitCreate}>
                    <UserSelection />
                    <CreateSessionOptions>
                        <Button type="submit">
                            <FormattedMessage id="Menu.General.Session.New" />
                        </Button>
                        <Button onClick={createFromCurrent}>
                            <FormattedMessage id="Menu.General.Session.NewFromCurrent" />
                        </Button>
                    </CreateSessionOptions>
                </form>
                <form onSubmit={onSubmitJoin}>
                    <SessionIdInput />
                    <Button type="submit">
                        <FormattedMessage id="DialogMenu.CreateOnline.JoinButton" />
                    </Button>
                </form>
            </DialogContent>
        </>
    )
}

export default OnlineSession
