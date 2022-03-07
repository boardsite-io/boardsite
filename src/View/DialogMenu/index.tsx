import React from "react"
import { Dialog } from "components"
import { online, useOnline } from "state/online"
import { useParams } from "react-router-dom"
import { DialogState } from "state/online/state/index.types"
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
}

const DialogMenu: React.FC = () => {
    const { dialogState, session } = useOnline()
    const { sid } = useParams()
    const contentType =
        sid && !session?.isConnected() ? DialogState.JoinOnly : dialogState

    return (
        <Dialog open={dialogState !== DialogState.Closed} onClose={handleClose}>
            {contents[contentType]}
        </Dialog>
    )
}

export default DialogMenu
