import React, { useState } from "react"
import { useSelector } from "react-redux"
import { BsGear } from "react-icons/bs"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
// import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import FormLabel from "@material-ui/core/FormLabel"
import FormControl from "@material-ui/core/FormControl"
import FormGroup from "@material-ui/core/FormGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Switch from "@material-ui/core/Switch"
import {
    TOGGLE_SHOULD_CENTER,
    TOGGLE_HIDE_NAVBAR,
} from "../../../redux/slice/viewcontrol"
import store from "../../../redux/store"

export default function SettingsButton() {
    const [open, setOpen] = useState(false)

    const keepCentered = useSelector((state) => state.viewControl.keepCentered)
    const hideNavBar = useSelector((state) => state.viewControl.hideNavBar)

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <>
            <button type="button" id="icon-button" onClick={handleClickOpen}>
                <BsGear id="icon" />
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
                    {/* <DialogContentText id="alert-dialog-description">
                        Change global settings here.
                    </DialogContentText> */}
                    <FormControl component="fieldset">
                        <FormLabel component="legend">
                            General Settings
                        </FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={keepCentered}
                                        onChange={() =>
                                            store.dispatch(
                                                TOGGLE_SHOULD_CENTER()
                                            )
                                        }
                                        name="jason"
                                    />
                                }
                                label="Keep view centered"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={hideNavBar}
                                        onChange={() =>
                                            store.dispatch(TOGGLE_HIDE_NAVBAR())
                                        }
                                        name="jason"
                                    />
                                }
                                label="Hide navigation bar"
                            />
                        </FormGroup>
                    </FormControl>
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
