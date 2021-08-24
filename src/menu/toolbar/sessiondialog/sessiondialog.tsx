import React from "react"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import { Grid, TextField } from "@material-ui/core"
import { BsPeople } from "react-icons/bs"
import { useHistory } from "react-router-dom"
import IconButton from "../../../components/iconbutton/iconbutton"
import store from "../../../redux/store"
import {
    SET_SDIAG,
    CLOSE_SDIAG,
    SET_USER_ALIAS,
    SET_USER_COLOR,
} from "../../../redux/slice/webcontrol"
import {
    getSessionPath,
    isConnected,
    joinSession,
    newSession,
} from "../../../api/websocket"
import "../../../css/sessiondialog.css"
import { useCustomDispatch, useCustomSelector } from "../../../redux/hooks"

const SessionDialog: React.FC = () => {
    const sDiagStatus = useCustomSelector(
        (state) => state.webControl.sessionDialog
    )
    const alias = useCustomSelector((state) => state.webControl.user.alias)
    const color = useCustomSelector((state) => state.webControl.user.color)

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
    /**
     * Handle the create session button click in the session dialog
     */
    function handleCreate() {
        newSession().then((sessionId) => {
            dispatch(SET_SDIAG({ sidInput: sessionId }))
            handleJoin()
        })
        // .catch((err) => console.log("cant create session: ", err))
    }

    /**
     * Handle the join session button click in the session dialog
     */
    function handleJoin() {
        joinSession()
            .then(() => {
                history.push(
                    getSessionPath(
                        store.getState().webControl.sessionDialog.sidInput
                    )
                )
                dispatch(CLOSE_SDIAG())
            })
            .catch(() =>
                dispatch(
                    SET_SDIAG({
                        open: true,
                        invalidSid: true,
                        joinOnly: false,
                    })
                )
            )
    }

    /**
     * Handle textfield events in the session dialog
     * @param {event} e event object
     */
    function handleTextFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
        dispatch(SET_SDIAG({ sidInput: e.target.value }))
    }

    function handleAliasChange(e: React.ChangeEvent<HTMLInputElement>) {
        dispatch(SET_USER_ALIAS(e.target.value))
    }

    function newRandomColor() {
        dispatch(SET_USER_COLOR())
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
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    Collaborative Session{" "}
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
                            {/* <DialogContentText id="alert-dialog-description">
                                Choose alias and color. Click on color to
                                randomly generate a new color.
                            </DialogContentText> */}
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
                                        inputProps={{ maxLength: 20 }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            {!sDiagStatus.joinOnly ? (
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleCreate}
                                    color="primary">
                                    Create Session
                                </Button>
                            ) : (
                                <></>
                            )}
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
                            {!sDiagStatus.joinOnly ? (
                                <TextField
                                    fullWidth
                                    label="Insert ID"
                                    // variant="outlined"
                                    // defaultValue="hi"
                                    value={sDiagStatus.sidInput}
                                    onChange={handleTextFieldChange}
                                    error={sDiagStatus.invalidSid}
                                    helperText={
                                        sDiagStatus.invalidSid
                                            ? "Looks like the session you're trying to join does not exist 🤖"
                                            : ""
                                    }
                                />
                            ) : (
                                <></>
                            )}
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

export default SessionDialog
