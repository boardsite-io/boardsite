import { Button, DownloadIcon } from "components"
import { handleExportDocument } from "drawing/handlers"
import React from "react"
import { END_LOADING, START_LOADING } from "redux/loading/loading"
import store from "redux/store"

interface PdfDownloadProps {
    closePageOptions: () => void
}
const PdfDownload: React.FC<PdfDownloadProps> = ({ closePageOptions }) => {
    const onClick = async () => {
        store.dispatch(START_LOADING("Processing..."))
        // Use setTimeout to start handleExportDocument in its own thread
        // This way the loading dispatch gets called before processing the rest
        setTimeout(async () => {
            await handleExportDocument()
            store.dispatch(END_LOADING())
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
