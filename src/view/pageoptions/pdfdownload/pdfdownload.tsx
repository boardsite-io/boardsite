import { Button, DownloadIcon } from "components"
import { handleExportDocument } from "drawing/pdf"
import React from "react"

const PdfDownload: React.FC = () => (
    <Button withIcon onClick={handleExportDocument}>
        <DownloadIcon />
        Export as PDF
    </Button>
)

export default PdfDownload
