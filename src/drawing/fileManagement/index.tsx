import store from "redux/store"
import { IntlMessageId } from "language"
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
import { LOAD_BOARD_STATE } from "redux/board"
import { BoardState } from "redux/board/index.types"
import { isConnected } from "api/session"
import { menu } from "state/menu"
import { loading } from "state/loading"
import { handleImportPdfFile, renderAsPdf } from "./pdf"
import { handleImportWorkspaceFile, saveWorkspace } from "./workspace"

export const handleProcessFileImport = async (
    file: File
): Promise<IntlMessageId | undefined> => {
    if (file.type === "application/pdf") {
        await handleImportPdfFile(file)
        return undefined
    }

    if (file.name.endsWith(FILE_EXTENSION_WORKSPACE)) {
        if (isConnected()) {
            return "ImportMenu.Error.NoWorkspaceInSession"
        }

        const partialRootState = await handleImportWorkspaceFile(file)

        if (partialRootState.board) {
            store.dispatch(
                LOAD_BOARD_STATE(partialRootState.board as BoardState)
            )
            return undefined
        }

        return "ImportMenu.Error.NoBoardStateFound"
    }

    return "ImportMenu.Error.InvalidFileType"
}

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
            menu.closeMainMenu()
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
            menu.closeMainMenu()
        }
    }
}

export const handleExportPdf = async (): Promise<void> => {
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
    menu.closeMainMenu()
}
