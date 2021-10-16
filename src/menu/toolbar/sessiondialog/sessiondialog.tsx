import React from "react"
import { BsPeople } from "react-icons/bs"
import { useHistory } from "react-router-dom"
import { useCustomDispatch, useCustomSelector } from "redux/hooks"
import {
    Button,
    Dialog,
    DialogOptions,
    DialogTitle,
    IconButton,
} from "components"
import { isConnected } from "api/websocket"
import OfflineDialogContent from "./offlinedialogcontent/offlinedialogcontent"
import OnlineDialogContent from "./onlinedialogcontent/onlinedialogcontent"

const SessionDialog: React.FC = () => {
    const sDiagStatus = useCustomSelector(
        (state) => state.session.sessionDialog
    )
    const dispatch = useCustomDispatch()
    const history = useHistory()

    const handleClickOpen = () => {
        dispatch({
            type: "SET_SDIAG",
            payload: {
                open: true,
                invalidSid: false,
                joinOnly: false,
            },
        })
    }

    const handleClose = () => {
        dispatch({
            type: "CLOSE_SDIAG",
            payload: undefined,
        })
        if (!isConnected()) {
            history.push("/")
        }
    }

    return (
        <>
            <IconButton onClick={handleClickOpen}>
                <BsPeople id="icon" />
            </IconButton>
            <Dialog open={sDiagStatus.open} onClose={handleClose}>
                <DialogTitle>
                    Collaborative Session{" "}
                    <span role="img" aria-label="Panda">
                        👀
                    </span>
                </DialogTitle>
                {isConnected() ? (
                    <OnlineDialogContent />
                ) : (
                    <OfflineDialogContent />
                )}
                <DialogOptions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogOptions>
            </Dialog>
        </>
    )
}

export default SessionDialog
