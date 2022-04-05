import {
    FILE_DESCRIPTION_PDF,
    FILE_EXTENSION_PDF,
    FILE_NAME_PDF,
    MIME_TYPE_PDF,
} from "consts"
import { fileOpen, fileSave } from "browser-fs-access"
import { menu } from "state/menu"
import { notification } from "state/notification"
import { ENCRYPTED_PDF_ERROR, importPdfFile, renderAsPdf } from "./util"
import { startBackgroundJob } from "../util"

export const handleImportPdf = async () => {
    menu.closeMainMenu()
    try {
        await startBackgroundJob("Loading.ImportingPdf", async () => {
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
        })
    } catch {
        notification.create("Notification.PdfImportFailed")
    }
}

export const handleExportPdf = async (): Promise<void> => {
    menu.closeMainMenu()
    try {
        await startBackgroundJob("Loading.ExportingPdf", async () => {
            const pdfBytes = await renderAsPdf()
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
        })
    } catch (error) {
        if ((error as Error)?.message === ENCRYPTED_PDF_ERROR) {
            notification.create("Notification.PdfExportFailedEncrypted", 4000)
            return
        }
        notification.create("Notification.PdfExportFailed")
    }
}
