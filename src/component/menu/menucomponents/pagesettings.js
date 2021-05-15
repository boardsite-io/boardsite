import React, { useState } from "react"
import { BsGear } from "react-icons/bs"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
// import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import { Grid } from "@material-ui/core"
import { pageType } from "../../../constants"
import { handlePageBackground } from "../../../drawing/handlers"

export default function PageSettings({ setOpenOther }) {
    const [open, setOpen] = useState(false)

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setOpenOther(false)
    }

    const handleClick = (pageStyle) => () => {
        handlePageBackground(pageStyle)
        handleClose()
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
                <DialogTitle id="alert-dialog-title">
                    Select page background style
                </DialogTitle>
                <DialogContent>
                    <Grid
                        item
                        container
                        spacing={2}
                        direction="row"
                        justify="center"
                        alignItems="center">
                        <Grid item>
                            <button
                                type="button"
                                onClick={handleClick(pageType.BLANK)}
                                className="page-blank"
                            />
                        </Grid>
                        <Grid item>
                            <button
                                type="button"
                                onClick={handleClick(pageType.CHECKERED)}
                                className="page-checkered"
                            />
                        </Grid>
                        <Grid item>
                            <button
                                type="button"
                                onClick={handleClick(pageType.RULED)}
                                className="page-ruled"
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
