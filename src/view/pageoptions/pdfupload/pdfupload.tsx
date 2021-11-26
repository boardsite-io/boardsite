import React from "react"
import { Button, UploadIcon } from "components"
import store from "redux/store"
import { OPEN_PDF_UPLOAD } from "redux/menu/menu"

const PdfUpload: React.FC = () => {
    const handleOpen = () => {
        store.dispatch(OPEN_PDF_UPLOAD())
    }

    return (
        <Button withIcon onClick={handleOpen}>
            <UploadIcon />
            Upload PDF
        </Button>
    )
}

export default PdfUpload
