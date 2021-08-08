import React, { useState } from "react"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import { BsCloudUpload } from "react-icons/bs"
import FileDropZone from "./filedropzone"

const FileDropButton: React.FC = () => {
    const [dialogOpen, setDialogOpen] = useState(false)

    const handleOpen = () => {
        setDialogOpen(true)
    }

    const handleClose = () => {
        setDialogOpen(false)
    }

    return (
        <>
            <button type="button" id="icon-button" onClick={handleOpen}>
                <BsCloudUpload id="icon" />
            </button>
            <Dialog
                maxWidth="xs"
                fullWidth
                open={dialogOpen}
                onClose={handleClose}>
                <DialogContent>
                    <FileDropZone closeDialog={handleClose} />
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

export default FileDropButton
