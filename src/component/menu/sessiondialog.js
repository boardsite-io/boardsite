import React from "react"
import { GrClose } from "react-icons/gr"
import { SiReact } from "react-icons/si"
import { MdSettingsPower } from "react-icons/md"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from "@material-ui/core/DialogTitle"
import { createWebsocket } from "../../api/websocket"
import { createSession } from "../../api/request"

import "../../css/sessiondialog.css"

export default function AlertDialog({ open, setOpen }) {
    /**
     * Helper function for creating websocket connection and handling the resolve / reject
     * @param {string} sid
     */
    function createWS(sid) {
        createWebsocket(sid)
            .then(() => {
                navigator.clipboard.writeText(sid)
                setOpen(false)
            })
            .catch((error) =>
                console.error("Websocket creation failed!", error)
            )
    }

    /**
     * Handle the create session button click in the session dialog
     */
    function handleCreate() {
        createSession()
            .then(({ sessionId }) => {
                createWS(sessionId)
            })
            .catch(() => console.log("Session creation failed!"))
    }

    /**
     * Handle the join session button click in the session dialog
     */
    function handleJoin() {
        // createWS(sidInput)
        console.log("XD")
    }

    /**
     * Handle textfield events in the session dialog
     * @param {event} e event object
     */
    function handleTextFieldChange(e) {
        if (e.target.value.length === 6) {
            console.log(e.target.value)
            createWS(e.target.value)
        }
    }

    return (
        <div>
            <Dialog
                id="sessionDialog"
                open={open}
                onClose={() => setOpen(false)}>
                <DialogTitle id="alert-dialog-title">
                    Create or join a session!
                </DialogTitle>
                <DialogContent>
                    {/* <DialogContentText id="alert-dialog-description">
                        Let Google scam you.
                    </DialogContentText> */}
                    <div className="dialog-wrap">
                        <div className="dialog-buttons-wrap">
                            <button
                                type="button"
                                id="buttonDialog"
                                onClick={handleCreate}>
                                <SiReact id="buttonIcon" />
                            </button>
                            <button
                                type="button"
                                id="buttonDialog"
                                onClick={handleJoin}>
                                <MdSettingsPower id="buttonIcon" />
                            </button>
                        </div>
                        <input
                            className="sessionDialogInput"
                            type="search"
                            defaultValue="hi"
                            onChange={handleTextFieldChange}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <button
                        type="button"
                        id="close-button"
                        onClick={() => setOpen(false)}>
                        <GrClose id="buttonIcon" />
                    </button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
