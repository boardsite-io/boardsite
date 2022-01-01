import React from "react"
import { BsPeople } from "react-icons/bs"
import { IconButton } from "components"
import { SET_SESSION_DIALOG } from "redux/session/session"
import store from "redux/store"

const handleClickOpen = () => {
    store.dispatch(
        SET_SESSION_DIALOG({
            showInitialOptions: false,
            open: true,
            invalidSid: false,
            joinOnly: false,
        })
    )
}

const Session: React.FC = () => (
    <IconButton onClick={handleClickOpen}>
        <BsPeople id="icon" />
    </IconButton>
)

export default Session
