import React from "react"
import { Dialog } from "components"
import { online, useOnline } from "state/online"
import { useParams } from "react-router-dom"
import { isConnected } from "api/session"
import { DialogState } from "state/online/state/index.types"
import ManageOnlineSession from "./ManageOnlineSession"
import CreateOnlineSession from "./CreateOnlineSession"
import InitialSelection from "./InitialSelection"
import JoinOnly from "./JoinOnly"

const handleClose = () => {
    online.setSessionDialog(DialogState.Closed)
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
    const { dialogState } = useOnline()
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
