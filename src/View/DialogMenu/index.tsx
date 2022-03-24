import React from "react"
import { Dialog } from "components"
import { useGState } from "state"
import { menu } from "state/menu"
import { DialogState } from "state/menu/state/index.types"
import OnlineCreate from "./OnlineCreate"
import InitialSelection from "./InitialSelection"
import OnlineJoin from "./OnlineJoin"
import OnlineChangeAlias from "./OnlineChangeAlias"
import OnlineChangePassword from "./OnlineChangePassword"

const handleClose = () => {
    menu.setDialogState(DialogState.Closed)
}

const contents = {
    [DialogState.Closed]: null,
    [DialogState.InitialSelection]: <InitialSelection firstLoad={false} />,
    [DialogState.InitialSelectionFirstLoad]: <InitialSelection firstLoad />,
    [DialogState.OnlineCreate]: <OnlineCreate />,
    [DialogState.OnlineJoin]: <OnlineJoin />,
    [DialogState.OnlineChangeAlias]: <OnlineChangeAlias />,
    [DialogState.OnlineChangePassword]: <OnlineChangePassword />,
}

const DialogMenu: React.FC = () => {
    const { dialogState } = useGState("DialogState").menu

    return (
        <Dialog open={dialogState !== DialogState.Closed} onClose={handleClose}>
            {contents[dialogState]}
        </Dialog>
    )
}

export default DialogMenu
