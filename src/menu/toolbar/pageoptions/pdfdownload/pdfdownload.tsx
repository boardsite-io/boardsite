import { Button, DownloadIcon } from "components"
import { handleExportDocument } from "redux/drawing/util/handlers"
import React from "react"
import store from "redux/store"

interface PdfDownloadProps {
    closePageOptions: () => void
}
const PdfDownload: React.FC<PdfDownloadProps> = ({ closePageOptions }) => {
    const onClick = async () => {
        store.dispatch({ type: "START_LOADING", payload: "Processing..." })
        // Use setTimeout to start handleExportDocument in its own thread
        // This way the loading dispatch gets called before processing the rest
        setTimeout(async () => {
            await handleExportDocument()
            store.dispatch({ type: "END_LOADING", payload: undefined })
            closePageOptions()
        }, 0)
    }

    return (
        <Button withIcon onClick={onClick}>
            <DownloadIcon />
            Export as PDF
        </Button>
    )
}

export default PdfDownload
