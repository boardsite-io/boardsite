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
    try {
        loading.startLoading({ messageId: "Loading.ExportingPdf" })
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
            notification.create("Notification.PdfExportFailedEncrypted", 4000)
        } else {
            notification.create("Notification.PdfExportFailed")
        }

        loading.endLoading()
    }
}
