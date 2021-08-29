import React, { useState } from "react"
import Button from "@material-ui/core/Button"
import DialogActions from "@material-ui/core/DialogActions"
import { BsCloudUpload } from "react-icons/bs"
import { Dialog, IconButton } from "@components"
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
            <IconButton onClick={handleOpen}>
                <BsCloudUpload id="icon" />
            </IconButton>
            <Dialog open={dialogOpen} onClose={handleClose}>
                <FileDropZone closeDialog={handleClose} />
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
