import React from "react"
import store from "redux/store"
import { Dialog } from "components"
import { useCustomSelector } from "hooks"
import { useParams } from "react-router-dom"
import { isConnected } from "api/session"
import { SET_SESSION_DIALOG } from "redux/session"
import { DialogState } from "redux/session/index.types"
import ManageOnlineSession from "./ManageOnlineSession"
import CreateOnlineSession from "./CreateOnlineSession"
import InitialSelection from "./InitialSelection"
import JoinOnly from "./JoinOnly"

const handleClose = () => {
    store.dispatch(SET_SESSION_DIALOG(DialogState.Closed))
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
    const dialogState = useCustomSelector((state) => state.session.dialogState)
    const { sid } = useParams()
    const contentType =
        sid && !isConnected() ? DialogState.JoinOnly : dialogState

    return (
        <Dialog open={dialogState !== DialogState.Closed} onClose={handleClose}>
            {contents[contentType]}
        </Dialog>
    )
}

export default Session
