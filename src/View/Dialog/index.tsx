import React, { useCallback } from "react"
import { Dialog } from "components"
import { useGState } from "state"
import { menu } from "state/menu"
import { DialogState } from "state/menu/state/index.types"
import { useNavigate } from "react-router-dom"
import { ROUTE } from "App/routes"
import { online } from "state/online"
import OnlineCreate from "./OnlineCreate"
import InitialSelection from "./InitialSelection"
import OnlineJoin from "./OnlineJoin"
import OnlineChangeAlias from "./OnlineChangeAlias"
import OnlineChangePassword from "./OnlineChangePassword"
import OnlineEnterPassword from "./OnlineEnterPassword"
import OnlineLeave from "./OnlineLeave"
import Subscribe from "./Subscribe"

const contents = {
    [DialogState.Closed]: null,
    [DialogState.InitialSelection]: <InitialSelection firstLoad={false} />,
    [DialogState.InitialSelectionFirstLoad]: <InitialSelection firstLoad />,
    [DialogState.OnlineCreate]: <OnlineCreate />,
    [DialogState.OnlineJoin]: <OnlineJoin />,
    [DialogState.OnlineEnterPassword]: <OnlineEnterPassword />,
    [DialogState.OnlineChangeAlias]: <OnlineChangeAlias />,
    [DialogState.OnlineChangePassword]: <OnlineChangePassword />,
    [DialogState.OnlineLeave]: <OnlineLeave />,
    [DialogState.Subscribe]: <Subscribe />,
}

const DialogMenu: React.FC = () => {
    const { dialogState } = useGState("DialogState").menu
    const navigate = useNavigate()

    const onCloseDialog = useCallback(() => {
        menu.setDialogState(DialogState.Closed)
        if (!online.isConnected()) {
            navigate(ROUTE.HOME)
        }
    }, [navigate])

    return (
        <Dialog
            open={dialogState !== DialogState.Closed}
            onClose={onCloseDialog}
        >
            {contents[dialogState]}
        </Dialog>
    )
}

export default DialogMenu
