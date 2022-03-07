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
import { OnlineSessionOptions } from "./index.styled"

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

    /**
     * Handle the create session button click in the session dialog
     */
    const handleCreate = useCallback(async () => {
        try {
            const session = new BoardSession(online.state.userSelection)
            await session.create()
            await handleJoin(session)
        } catch (error) {
            notification.create("SessionMenu.CreateOnline.Error")
        }
    }, [handleJoin])

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

    let helperText: JSX.Element | undefined

    if (!isValidInput) {
        helperText = (
            <FormattedMessage id="SessionMenu.JoinOnly.Error.UnableToJoin" />
        )
    }
    return (
        <>
            <DialogTitle>
                <FormattedMessage id="SessionMenu.CreateOnline.Title" />
            </DialogTitle>
            <DialogContent>
                <form onSubmit={onSubmit}>
                    <UserSelection />
                    <OnlineSessionOptions>
                        <Button onClick={handleCreate}>
                            <FormattedMessage id="SessionMenu.CreateOnline.CreateButton" />
                        </Button>
                        <Button type="submit">
                            <FormattedMessage id="SessionMenu.CreateOnline.JoinButton" />
                        </Button>
                    </OnlineSessionOptions>
                    <TextField
                        label={
                            <FormattedMessage id="SessionMenu.CreateOnline.TextFieldLabel.SessionId" />
                        }
                        value={sidInput}
                        onChange={handleTextFieldChange}
                        helperText={helperText}
                    />
                </form>
            </DialogContent>
        </>
    )
}

export default CreateOnlineSession
