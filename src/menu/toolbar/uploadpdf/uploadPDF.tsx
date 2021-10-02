import React, { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogOptions,
    Button,
    UploadIcon,
} from "components"
import FileDropZone from "./filedropzone"

interface FileDropButtonProps {
    closePageOptions: () => void
}

const UploadPDFButton: React.FC<FileDropButtonProps> = ({
    closePageOptions,
}) => {
    const [dialogOpen, setDialogOpen] = useState(false)

    const handleOpen = () => {
        setDialogOpen(true)
    }

    const handleClose = () => {
        setDialogOpen(false)
        closePageOptions()
    }

    return (
        <>
            <Button withIcon onClick={handleOpen}>
                <UploadIcon />
                Upload PDF
            </Button>
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

export default UploadPDFButton