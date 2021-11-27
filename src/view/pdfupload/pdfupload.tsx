import React from "react"
import { Dialog, DialogContent, DialogOptions, Button } from "components"
import { useCustomSelector } from "hooks"
import store from "redux/store"
import { CLOSE_PAGE_ACTIONS, CLOSE_PDF_UPLOAD } from "redux/menu/menu"
import FileDropZone from "./filedropzone"

const PdfUpload: React.FC = () => {
    const pdfUploadOpen = useCustomSelector((state) => state.menu.pdfUploadOpen)

    const handleClose = () => {
        store.dispatch(CLOSE_PDF_UPLOAD())
        store.dispatch(CLOSE_PAGE_ACTIONS())
    }

    return (
        <Dialog open={pdfUploadOpen} onClose={handleClose}>
            <DialogContent>
                <FileDropZone closeDialog={handleClose} />
            </DialogContent>
            <DialogOptions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogOptions>
        </Dialog>
    )
}

export default PdfUpload
