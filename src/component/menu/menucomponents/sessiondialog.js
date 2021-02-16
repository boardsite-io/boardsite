import React, { useState } from "react"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import { Grid, TextField } from "@material-ui/core"
import { BsPeople } from "react-icons/bs"
import { newSession, joinSession } from "../../../api/websocket"

export default function SessionDialog() {
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }
    /**
     * Handle the create session button click in the session dialog
     */
    function handleCreate() {
        newSession()
            .then((sessionId) => handleJoin(sessionId))
            .catch((err) => console.log("cant create session: ", err))
    }

    /**
     * Handle the join session button click in the session dialog
     */
    function handleJoin(sessionId) {
        // createWS(sidInput)
        // request data?
        joinSession(sessionId)
            .then(() => setOpen(false))
            .catch(() => console.log("cant connect"))
    }

    /**
     * Handle textfield events in the session dialog
     * @param {event} e event object
     */
    function handleTextFieldChange(e) {
        if (e.target.value.length === 6) {
            console.log(e.target.value)
            handleJoin(e.target.value)
        }
    }

    return (
        <>
            <button type="button" id="icon-button" onClick={handleClickOpen}>
                <BsPeople id="icon" />
            </button>
            <Dialog
                maxWidth="xs"
                fullWidth
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">Settings</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Change global settings here.
                    </DialogContentText>
                    <Grid
                        container
                        spacing={2}
                        direction="column"
                        // justify="center"
                        alignItems="flex-start">
                        <Grid item>
                            <Button
                                variant="contained"
                                onClick={handleCreate}
                                color="primary">
                                Create Session
                            </Button>
                        </Grid>
                        <Grid container item>
                            <Button
                                variant="contained"
                                onClick={handleJoin}
                                color="primary">
                                Join Session
                            </Button>
                        </Grid>
                        <Grid item>
                            <TextField
                                id="outlined-basic"
                                label="Insert Session ID"
                                // variant="outlined"
                                // defaultValue="hi"
                                onChange={handleTextFieldChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
