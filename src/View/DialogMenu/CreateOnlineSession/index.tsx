import { FormattedMessage } from "language"
import React, { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Session, SessionConfig } from "api/types"
import { BoardSession } from "api/session"
import {
    Button,
    DialogContent,
    DialogTitle,
    TextField,
    UserSelection,
} from "components"
import { online } from "state/online"
import { notification } from "state/notification"
import { DialogState } from "state/online/state/index.types"
import { OnlineSessionOptions as CreateSessionOptions } from "./index.styled"

const CreateOnlineSession: React.FC = () => {
    const [sidInput, setSidInput] = useState<string>("")
    const [isValidInput, setIsValidInput] = useState<boolean>(true)
    const navigate = useNavigate()

    /**
     * Handle the join session button click in the session dialog
     */
    const handleJoin = useCallback(
        async (session: Session) => {
            try {
                const path = BoardSession.path(session.config?.id ?? "")
                await session.createSocket(path.split("/").pop() ?? "")
                await session.join()

                online.setSessionDialog(DialogState.Closed)
                navigate(path)
            } catch (error) {
                setIsValidInput(false)
            }
        },
        [navigate]
    )

    const createAndJoin = useCallback(
        async (copyOffline: boolean) => {
            try {
                const session = new BoardSession(online.state.userSelection)
                const sessionId = await session.create()
                await session.createSocket(sessionId)
                await session.join(copyOffline)
                online.newSession(session)
                online.setSessionDialog(DialogState.Closed)
                navigate(BoardSession.path(sessionId))
            } catch (error) {
                notification.create("Notification.Session.CreationFailed", 2000)
                return
            }

            navigator.clipboard
                .writeText(window.location.href)
                .then(() =>
                    notification.create(
                        "Notification.Session.CopiedToClipboard"
                    )
                )
        },
        [navigate]
    )

    /**
     * Handle textfield events in the session dialog
     * @param {event} e event object
     */
    const handleTextFieldChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSidInput(e.target.value)
        },
        []
    )

    const onSubmit = useCallback(
        async (e: React.ChangeEvent<HTMLFormElement>) => {
            e.preventDefault()
            const session = new BoardSession(online.state.userSelection)
            session.config = { id: sidInput } as SessionConfig
            await handleJoin(session)
        },
        [handleJoin, sidInput]
    )

    return (
        <form onSubmit={onSubmit}>
            <DialogTitle>
                <FormattedMessage id="DialogMenu.CreateOnline.Title" />
            </DialogTitle>
            <DialogContent>
                <UserSelection />
                <CreateSessionOptions>
                    <Button onClick={() => createAndJoin(false)}>
                        <FormattedMessage id="Menu.General.Session.New" />
                    </Button>
                    <Button onClick={() => createAndJoin(true)}>
                        <FormattedMessage id="Menu.General.Session.NewFromCurrent" />
                    </Button>
                </CreateSessionOptions>
                <TextField
                    label={
                        <FormattedMessage id="DialogMenu.CreateOnline.TextFieldLabel.SessionId" />
                    }
                    value={sidInput}
                    onChange={handleTextFieldChange}
                    error={!isValidInput}
                    helperText={
                        !isValidInput && (
                            <FormattedMessage id="Notification.Session.JoinFailed" />
                        )
                    }
                />
                <Button type="submit">
                    <FormattedMessage id="DialogMenu.CreateOnline.JoinButton" />
                </Button>
            </DialogContent>
        </form>
    )
}

export default CreateOnlineSession
