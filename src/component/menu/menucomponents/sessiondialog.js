import React, { useState } from "react"
import Konva from "konva"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import { Grid, TextField } from "@material-ui/core"
import { BsPeople } from "react-icons/bs"
import { newSession, joinSession } from "../../../api/websocket"
import "../../../css/sessiondialog.css"

export default function SessionDialog() {
    const [open, setOpen] = useState(false)
    const [sid, setSid] = useState("")
    const [alias, setAlias] = useState("")
    const [color, setColor] = useState(Konva.Util.getRandomColor())

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
            .then((sessionId) => {
                joinSession(sessionId).then(() => setOpen(false))
            })
            .catch((err) => console.log("cant create session: ", err))
    }

    /**
     * Handle the join session button click in the session dialog
     */
    function handleJoin() {
        // createWS(sidInput)
        // request data?
        joinSession(sid)
            .then(() => setOpen(false))
            .catch(() => console.log("cant connect"))
    }

    /**
     * Handle textfield events in the session dialog
     * @param {event} e event object
     */
    function handleTextFieldChange(e) {
        setSid(e.target.value)
    }

    function handleAliasChange(e) {
        setAlias(e.target.value)
    }

    function newRandomColor() {
        setColor(Konva.Util.getRandomColor())
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
                <DialogTitle id="alert-dialog-title">
                    Create or join a session{" "}
                    <span role="img" aria-label="Panda">
                        👀
                    </span>
                </DialogTitle>
                <DialogContent>
                    <Grid
                        container
                        spacing={2}
                        direction="column"
                        justify="center"
                        alignItems="stretch">
                        <Grid item>
                            <DialogContentText id="alert-dialog-description">
                                Choose alias and color. Click on color to
                                randomly generate a new color.
                            </DialogContentText>
                            <Grid
                                item
                                container
                                spacing={2}
                                direction="row"
                                justify="flex-start"
                                alignItems="center">
                                <Grid item>
                                    <button
                                        className="userColor"
                                        type="button"
                                        style={{ background: color }}
                                        onClick={newRandomColor}
                                    />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        // style={{ width: "100%" }}
                                        fullWidth
                                        value={alias}
                                        label="Choose alias"
                                        // variant="outlined"
                                        // defaultValue="hi"
                                        onChange={handleAliasChange}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleCreate}
                                color="primary">
                                Create Session
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleJoin}
                                color="primary">
                                Join Session
                            </Button>
                        </Grid>
                        <Grid item>
                            <TextField
                                fullWidth
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
