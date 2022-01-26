import store from "redux/store"
import { END_LOADING, START_LOADING } from "redux/loading/loading"
import { CLOSE_MAIN_MENU } from "redux/menu/menu"
import {
    FILE_DESCRIPTION_PDF,
    FILE_DESCRIPTION_WORKSPACE,
    FILE_EXTENSION_PDF,
    FILE_EXTENSION_WORKSPACE,
    FILE_NAME_PDF,
    FILE_NAME_WORKSPACE,
    MIME_TYPE_PDF,
    MIME_TYPE_WORKSPACE,
} from "consts"
import { fileOpen, fileSave } from "browser-fs-access"
import { handleProcessFileImport } from "drawing/attachment"
import { saveWorkspace } from "redux/workspace"
import { getPdfBytes } from "./pdfRender"

export const handleImportPdf = async () => {
    const file = await fileOpen({
        description: FILE_DESCRIPTION_PDF,
        mimeTypes: [MIME_TYPE_PDF],
        extensions: [FILE_EXTENSION_PDF],
        multiple: false,
    })

    if (file) {
        const errorMessage = await handleProcessFileImport(file)

        if (errorMessage === undefined) {
            store.dispatch(CLOSE_MAIN_MENU())
        }
    }
}

export const handleImportWorkspace = async () => {
    const file = await fileOpen({
        description: FILE_DESCRIPTION_WORKSPACE,
        mimeTypes: [MIME_TYPE_WORKSPACE],
        extensions: [FILE_EXTENSION_WORKSPACE],
        multiple: false,
    })

    if (file) {
        const errorMessage = await handleProcessFileImport(file)

        if (errorMessage === undefined) {
            store.dispatch(CLOSE_MAIN_MENU())
        }
    }
}

export const handleExportPdf = async (): Promise<void> => {
    store.dispatch(START_LOADING({ messageId: "Loading.ExportingPdf" }))
    const pdfBytes = await getPdfBytes()
    store.dispatch(END_LOADING())

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

    store.dispatch(CLOSE_MAIN_MENU())
}

export const handleExportWorkspace = async () => {
    const file = saveWorkspace(store.getState())

    // Save to file system
    await fileSave(
        new Blob([file], {
            type: MIME_TYPE_WORKSPACE,
        }),
        {
            fileName: FILE_NAME_WORKSPACE,
            description: FILE_DESCRIPTION_WORKSPACE,
            extensions: [FILE_EXTENSION_WORKSPACE],
        }
    )

    store.dispatch(CLOSE_MAIN_MENU())
}
