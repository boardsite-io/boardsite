import React, { useState } from "react"
import { BsGear } from "react-icons/bs"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
// import DialogContentText from "@material-ui/core/DialogContentText"
import { PageBackground } from "types"
import DialogTitle from "@material-ui/core/DialogTitle"
import { handlePageBackground } from "drawing/handlers"
import { Grid } from "@material-ui/core"
import { IconButton } from "@components"
import {
    PagePreviewBlank,
    PagePreviewCheckered,
    PagePreviewRuled,
} from "./pagesettings.styled"
import { pageType } from "../../../constants"

const ShapeTools: React.FC<{
    setOpenOther: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ setOpenOther }) => {
    const [open, setOpen] = useState(false)

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setOpenOther(false)
    }

    const handleClick = (pageStyle: PageBackground) => () => {
        handlePageBackground(pageStyle)
        handleClose()
    }

    return (
        <>
            <IconButton onClick={handleClickOpen}>
                <BsGear id="icon" />
            </IconButton>
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
                        justifyContent="center"
                        alignItems="center">
                        <Grid item>
                            <PagePreviewBlank
                                type="button"
                                onClick={handleClick(pageType.BLANK)}
                            />
                        </Grid>
                        <Grid item>
                            <PagePreviewCheckered
                                type="button"
                                onClick={handleClick(pageType.CHECKERED)}
                            />
                        </Grid>
                        <Grid item>
                            <PagePreviewRuled
                                type="button"
                                onClick={handleClick(pageType.RULED)}
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

export default ShapeTools
