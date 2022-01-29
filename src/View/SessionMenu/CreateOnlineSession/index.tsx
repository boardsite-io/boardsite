import { FormattedMessage } from "language"
import React, { useState } from "react"
import store from "redux/store"
import { useNavigate } from "react-router-dom"
import { SET_SESSION_DIALOG } from "redux/session"
import { BoardSession, currentSession } from "api/session"
import {
    Button,
    DialogContent,
    DialogTitle,
    TextField,
    UserSelection,
} from "components"
import { DialogState } from "redux/session/index.types"
import { OnlineSessionOptions } from "./index.styled"

const CreateOnlineSession: React.FC = () => {
    const [sidInput, setSidInput] = useState<string>("")
    const [isValidInput, setIsValidInput] = useState<boolean>(true)
    const navigate = useNavigate()

    /**
     * Handle the create session button click in the session dialog
     */
    const handleCreate = async () => {
        try {
            const sessionId = await currentSession().create()
            await handleJoin(sessionId)
            setSidInput(sessionId)
        } catch (error) {
            // console.log("error")
        }
    }

    /**
     * Handle the join session button click in the session dialog
     */
    const handleJoin = async (sessionId: string) => {
        try {
            const path = BoardSession.path(sessionId)

            await currentSession().createSocket(path.split("/").pop() ?? "")
            await currentSession().join()

            navigate(path)
            store.dispatch(SET_SESSION_DIALOG(DialogState.Closed))
            setIsValidInput(true)
        } catch (error) {
            setIsValidInput(false)
        }
    }

    /**
     * Handle textfield events in the session dialog
     * @param {event} e event object
     */
    const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSidInput(e.target.value)
    }

    const onSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        handleJoin(sidInput)
    }

    let helperText: JSX.Element | undefined

    if (!isValidInput) {
        helperText = (
            <FormattedMessage id="SessionMenu.CreateOnline.InvalidSession" />
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
