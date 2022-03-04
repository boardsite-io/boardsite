import { FormattedMessage } from "language"
import React, { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { BoardSession, currentSession } from "api/session"
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
        async (sessionId: string) => {
            try {
                const path = BoardSession.path(sessionId)

                await currentSession().createSocket(path.split("/").pop() ?? "")
                await currentSession().join()

                navigate(path)
                online.setSessionDialog(DialogState.Closed)
                setIsValidInput(true)
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
            const sessionId = await currentSession().create()
            await handleJoin(sessionId)
            setSidInput(sessionId)
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
        (e: React.ChangeEvent<HTMLFormElement>) => {
            e.preventDefault()
            handleJoin(sidInput)
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
