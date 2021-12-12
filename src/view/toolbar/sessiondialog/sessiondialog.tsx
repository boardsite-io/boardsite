import React from "react"
import { BsPeople } from "react-icons/bs"
import { useNavigate } from "react-router-dom"
import { useCustomDispatch, useCustomSelector } from "hooks"
import {
    Button,
    Dialog,
    DialogOptions,
    DialogTitle,
    IconButton,
} from "components"
import { SET_SESSION_DIALOG, CLOSE_SESSION_DIALOG } from "redux/session/session"
import { isConnected } from "api/session"
import OfflineDialogContent from "./offlinedialogcontent/offlinedialogcontent"
import OnlineDialogContent from "./onlinedialogcontent/onlinedialogcontent"

const SessionDialog: React.FC = () => {
    const sDiagStatus = useCustomSelector(
        (state) => state.session.sessionDialog
    )
    const dispatch = useCustomDispatch()
    const navigate = useNavigate()

    const handleClickOpen = () => {
        dispatch(
            SET_SESSION_DIALOG({
                open: true,
                invalidSid: false,
                joinOnly: false,
            })
        )
    }

    const handleClose = () => {
        dispatch(CLOSE_SESSION_DIALOG())
        if (!isConnected()) {
            navigate("/")
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
