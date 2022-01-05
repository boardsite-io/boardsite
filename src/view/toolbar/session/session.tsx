import React from "react"
import { BsPeople } from "react-icons/bs"
import { IconButton, Position, ToolTip } from "components"
import { SET_SESSION_DIALOG } from "redux/session/session"
import store from "redux/store"
import { isConnected } from "api/session"
import { DialogState } from "redux/session/session.types"
import { ToolTipText } from "language"

const handleClickOpen = () => {
    if (isConnected()) {
        store.dispatch(SET_SESSION_DIALOG(DialogState.ManageOnlineSession))
    } else {
        store.dispatch(SET_SESSION_DIALOG(DialogState.CreateOnlineSession))
    }
}

const Session: React.FC = () => (
    <ToolTip position={Position.BottomRight} text={ToolTipText.Session}>
        <IconButton onClick={handleClickOpen}>
            <BsPeople id="icon" />
        </IconButton>
    </ToolTip>
)

export default Session
