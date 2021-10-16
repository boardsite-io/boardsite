import { Button, DownloadIcon } from "components"
import { handleExportDocument } from "drawing/handlers"
import React from "react"

interface PdfDownloadProps {
    closePageOptions: () => void
}
const PdfDownload: React.FC<PdfDownloadProps> = ({ closePageOptions }) => {
    const onClick = () => {
        handleExportDocument()
        closePageOptions()
    }

    return (
        <Button withIcon onClick={onClick}>
            <DownloadIcon />
            Export as PDF
        </Button>
    )
}

export default PdfDownload
