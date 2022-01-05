import { Button, Dialog, DialogOptions } from "components"
import React, { useEffect } from "react"
import { useCustomSelector } from "hooks"
import store from "redux/store"
import { NavigateFunction, useNavigate, useParams } from "react-router-dom"
import { currentSession, isConnected } from "api/session"
import { SET_SESSION_DIALOG } from "redux/session/session"
import { DialogState } from "redux/session/session.types"
import ManageOnlineSession from "./manageOnlineSession"
import CreateOnlineSession from "./createOnlineSession"
import InitialSelection from "./initialSelection"
import JoinOnly from "./joinOnly"

const checkSessionStatus = async (sid: string, navigate: NavigateFunction) => {
    try {
        await currentSession().setID(sid).ping()

        // Session exists
        store.dispatch(SET_SESSION_DIALOG(DialogState.JoinOnly))
    } catch (error) {
        store.dispatch(SET_SESSION_DIALOG(DialogState.CreateOnlineSession))
        // Session doesn't exist
        navigate("/")
    }
}

const contents = {
    [DialogState.Closed]: null,
    [DialogState.InitialSelection]: <InitialSelection firstLoad={false} />,
    [DialogState.InitialSelectionFirstLoad]: <InitialSelection firstLoad />,
    [DialogState.JoinOnly]: <JoinOnly />,
    [DialogState.CreateOnlineSession]: <CreateOnlineSession />,
    [DialogState.ManageOnlineSession]: <ManageOnlineSession />,
}

const Session: React.FC = () => {
    const navigate = useNavigate()
    const dialogState = useCustomSelector((state) => state.session.dialogState)
    const { sid } = useParams()

    useEffect(() => {
        if (sid && !isConnected()) {
            checkSessionStatus(sid, navigate)
        }
    }, [sid])

    const handleClose = () => {
        store.dispatch(SET_SESSION_DIALOG(DialogState.Closed))
    }

    return (
        <Dialog open={dialogState !== DialogState.Closed} onClose={handleClose}>
            {contents[dialogState]}
            <DialogOptions>
                <Button onClick={handleClose}>Close</Button>
            </DialogOptions>
        </Dialog>
    )
}

export default Session
