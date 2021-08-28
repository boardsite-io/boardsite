import React from "react"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import { BsPeople } from "react-icons/bs"
import { useHistory } from "react-router-dom"
import { useCustomDispatch, useCustomSelector } from "redux/hooks"
import IconButton from "../../../components/iconbutton/iconbutton"
import { SET_SDIAG, CLOSE_SDIAG } from "../../../redux/slice/webcontrol"
import { isConnected } from "../../../api/websocket"
import OfflineDialogContent from "./offlinedialogcontent/offlinedialogcontent"
import OnlineDialogContent from "./onlinedialogcontent/onlinedialogcontent"

const SessionDialog: React.FC = () => {
    const sDiagStatus = useCustomSelector(
        (state) => state.webControl.sessionDialog
    )
    const dispatch = useCustomDispatch()
    const history = useHistory()

    const handleClickOpen = () => {
        dispatch(
            SET_SDIAG({
                open: true,
                invalidSid: false,
                joinOnly: false,
            })
        )
    }

    const handleClose = () => {
        dispatch(CLOSE_SDIAG())
        if (!isConnected()) {
            history.push("/")
        }
    }

    return (
        <>
            <IconButton onClick={handleClickOpen}>
                <BsPeople id="icon" />
            </IconButton>
            <Dialog
                maxWidth="xs"
                fullWidth
                open={sDiagStatus.open}
                onClose={handleClose}>
                <DialogTitle id="alert-dialog-title">
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
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default SessionDialog
