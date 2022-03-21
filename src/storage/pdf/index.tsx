import {
    FILE_DESCRIPTION_PDF,
    FILE_EXTENSION_PDF,
    FILE_NAME_PDF,
    MIME_TYPE_PDF,
} from "consts"
import { fileOpen, fileSave } from "browser-fs-access"
import { menu } from "state/menu"
import { loading } from "state/loading"
import { notification } from "state/notification"
import { ENCRYPTED_PDF_ERROR, importPdfFile, renderAsPdf } from "./util"

export const handleImportPdf = async () => {
    try {
        const file = await fileOpen({
            description: FILE_DESCRIPTION_PDF,
            mimeTypes: [MIME_TYPE_PDF],
            extensions: [FILE_EXTENSION_PDF],
            multiple: false,
        })

        if (file.type !== "application/pdf") {
            notification.create("Notification.InvalidFileTypePdfImport")
            return
        }

        await importPdfFile(file)

        menu.closeMainMenu()
    } catch (error) {
        notification.create("Notification.PdfImportFailed")
    }
}

export const handleExportPdf = async (): Promise<void> => {
    loading.startLoading("Loading.ExportingPdf")

    /* 
        For some reason the loading dialog doesnt show if the pdf render 
        isnt delayed a little. Probably the state updates are combined and 
        then the pdf render blocks any updates until its finished.
    */
    setTimeout(async () => {
        try {
            const pdfBytes = await renderAsPdf()
            loading.endLoading()
            // Save to file system
            await fileSave(
                new Blob([pdfBytes], {
                    type: MIME_TYPE_PDF,
                }),
                {
                    fileName: FILE_NAME_PDF,
                    description: FILE_DESCRIPTION_PDF,
                    extensions: [FILE_EXTENSION_PDF],
                }
            )
            menu.closeMainMenu()
        } catch (error) {
            if ((error as Error)?.message === ENCRYPTED_PDF_ERROR) {
                notification.create(
                    "Notification.PdfExportFailedEncrypted",
                    4000
                )
            } else {
                notification.create("Notification.PdfExportFailed")
            }
            loading.endLoading() // Stop loading animation on error
        }
    }, 10)
}
