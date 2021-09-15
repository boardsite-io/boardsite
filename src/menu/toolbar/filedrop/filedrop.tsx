import React, { useState } from "react"
import {
    Dialog,
    DialogContent,
    IconButton,
    DialogOptions,
    Button,
    UploadIcon,
    DownloadIcon,
} from "components"
import { handleExportDocument } from "drawing/handlers"
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
                <UploadIcon />
            </IconButton>
            <IconButton onClick={() => handleExportDocument()}>
                <DownloadIcon />
            </IconButton>
            <Dialog open={dialogOpen} onClose={handleClose}>
                <DialogContent>
                    <FileDropZone closeDialog={handleClose} />
                </DialogContent>
                <DialogOptions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogOptions>
            </Dialog>
        </>
    )
}

export default FileDropButton
