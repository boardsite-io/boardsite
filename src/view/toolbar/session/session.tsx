import { FormattedMessage } from "language"
import React from "react"
import { BsPeople } from "react-icons/bs"
import { IconButton, Position, ToolTip } from "components"
import { SET_SESSION_DIALOG } from "redux/session/session"
import store from "redux/store"
import { isConnected } from "api/session"
import { DialogState } from "redux/session/session.types"

const handleClickOpen = () => {
    if (isConnected()) {
        store.dispatch(SET_SESSION_DIALOG(DialogState.ManageOnlineSession))
    } else {
        store.dispatch(SET_SESSION_DIALOG(DialogState.CreateOnlineSession))
    }
}

const Session: React.FC = () => {
    return (
        <ToolTip
            position={Position.BottomRight}
            text={<FormattedMessage id="ToolBar.Session" />}>
            <IconButton onClick={handleClickOpen}>
                <BsPeople id="transitory-icon" />
            </IconButton>
        </ToolTip>
    )
}

export default Session
