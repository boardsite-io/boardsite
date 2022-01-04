import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import store from "redux/store"
import { SET_SESSION_DIALOG } from "redux/session/session"
import { BoardSession, currentSession } from "api/session"
import {
    Button,
    DialogContent,
    DialogTitle,
    TextField,
    UserSelection,
} from "components"
import { DialogState } from "redux/session/session.types"

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

    return (
        <>
            <DialogTitle>Collaborative Session 👋🏻</DialogTitle>
            <DialogContent>
                <UserSelection />
                <Button onClick={handleCreate}>Create Session</Button>
                <Button onClick={() => handleJoin(sidInput)}>
                    Join Session
                </Button>
                <TextField
                    label="Insert ID"
                    value={sidInput}
                    onChange={handleTextFieldChange}
                    helperText={
                        isValidInput
                            ? ""
                            : "Looks like the session you're trying to join does not exist 🤖"
                    }
                />
            </DialogContent>
        </>
    )
}

export default CreateOnlineSession
