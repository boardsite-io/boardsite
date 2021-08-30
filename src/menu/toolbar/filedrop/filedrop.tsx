import React, { useState } from "react"
import Button from "@material-ui/core/Button"
import DialogActions from "@material-ui/core/DialogActions"
import { IconButton } from "@components"
import { BsCloudDownload, BsCloudUpload } from "react-icons/bs"
import { handleExportDocument } from "drawing/handlers"
import { Dialog } from "@material-ui/core"
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
            <IconButton onClick={() => handleExportDocument()}>
                <BsCloudDownload id="icon" />
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
