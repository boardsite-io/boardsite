import React from "react"
import { Dialog } from "components"
import { online } from "state/online"
import { useParams } from "react-router-dom"
import { DialogState } from "state/online/state/index.types"
import { useGState } from "state"
import OnlineSession from "./OnlineSession"
import InitialSelection from "./InitialSelection"
import OnlineSessionJoinOnly from "./OnlineSessionJoinOnly"

const handleClose = () => {
    online.setSessionDialog(DialogState.Closed)
}

const contents = {
    [DialogState.Closed]: null,
    [DialogState.InitialSelection]: <InitialSelection firstLoad={false} />,
    [DialogState.InitialSelectionFirstLoad]: <InitialSelection firstLoad />,
    [DialogState.CreateOnlineSession]: <OnlineSession />,
    [DialogState.JoinOnly]: <OnlineSessionJoinOnly />,
}

const DialogMenu: React.FC = () => {
    const { dialogState, session } = useGState("Session").online
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
