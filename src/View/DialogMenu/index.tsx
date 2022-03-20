import React from "react"
import { Dialog } from "components"
import { useParams } from "react-router-dom"
import { useGState } from "state"
import { menu } from "state/menu"
import { online } from "state/online"
import { DialogState } from "state/menu/state/index.types"
import OnlineSession from "./OnlineSession"
import InitialSelection from "./InitialSelection"
import OnlineSessionJoinOnly from "./OnlineSessionJoinOnly"

const handleClose = () => {
    menu.setSessionDialog(DialogState.Closed)
}

const contents = {
    [DialogState.Closed]: null,
    [DialogState.InitialSelection]: <InitialSelection firstLoad={false} />,
    [DialogState.InitialSelectionFirstLoad]: <InitialSelection firstLoad />,
    [DialogState.CreateOnlineSession]: <OnlineSession />,
    [DialogState.JoinOnly]: <OnlineSessionJoinOnly />,
}

const DialogMenu: React.FC = () => {
    const { dialogState } = useGState("DialogState").menu
    const { sessionId } = useParams()
    const contentType =
        sessionId && !online.state.session?.isConnected()
            ? DialogState.JoinOnly
            : dialogState

    return (
        <Dialog open={dialogState !== DialogState.Closed} onClose={handleClose}>
            {contents[contentType]}
        </Dialog>
    )
}

export default DialogMenu
