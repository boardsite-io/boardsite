import React, { useState } from "react"
import { BsGear } from "react-icons/bs"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import FormLabel from "@material-ui/core/FormLabel"
import FormControl from "@material-ui/core/FormControl"
import FormGroup from "@material-ui/core/FormGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Switch from "@material-ui/core/Switch"

export default function SettingsButton() {
    const [open, setOpen] = useState(false)
    const [check1, setCheck1] = useState(false)

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleChange = (event) => {
        setCheck1(event.target.checked)
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
                    <DialogContentText id="alert-dialog-description">
                        Change global settings here.
                    </DialogContentText>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">
                            Assign responsibility
                        </FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={open}
                                        onChange={handleChange}
                                        name="Open"
                                    />
                                }
                                label="Open State"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={check1}
                                        onChange={handleChange}
                                        name="jason"
                                    />
                                }
                                label="Jason Killian"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={check1}
                                        onChange={handleChange}
                                        name="antoine"
                                    />
                                }
                                label="Antoine Llorca"
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
