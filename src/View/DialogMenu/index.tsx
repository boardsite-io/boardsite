import React from "react"
import { Dialog } from "components"
import { useGState } from "state"
import { menu } from "state/menu"
import { DialogState } from "state/menu/state/index.types"
import { useNavigate } from "react-router-dom"
import { ROUTE } from "App/routes"
import OnlineCreate from "./OnlineCreate"
import InitialSelection from "./InitialSelection"
import OnlineJoin from "./OnlineJoin"
import OnlineChangeAlias from "./OnlineChangeAlias"
import OnlineChangePassword from "./OnlineChangePassword"
import OnlineEnterPassword from "./OnlineEnterPassword"

const contents = {
    [DialogState.Closed]: null,
    [DialogState.InitialSelection]: <InitialSelection firstLoad={false} />,
    [DialogState.InitialSelectionFirstLoad]: <InitialSelection firstLoad />,
    [DialogState.OnlineCreate]: <OnlineCreate />,
    [DialogState.OnlineJoin]: <OnlineJoin />,
    [DialogState.OnlineEnterPassword]: <OnlineEnterPassword />,
    [DialogState.OnlineChangeAlias]: <OnlineChangeAlias />,
    [DialogState.OnlineChangePassword]: <OnlineChangePassword />,
}

const DialogMenu: React.FC = () => {
    const { dialogState } = useGState("DialogState").menu
    const navigate = useNavigate()

    return (
        <Dialog
            open={dialogState !== DialogState.Closed}
            onClose={() => {
                menu.setDialogState(DialogState.Closed)
                navigate(ROUTE.HOME)
            }}
        >
            {contents[dialogState]}
        </Dialog>
    )
}

export default DialogMenu
