import { fileOpen, fileSave } from "browser-fs-access"
import {
    FILE_DESCRIPTION_WORKSPACE,
    FILE_EXTENSION_WORKSPACE,
    FILE_NAME_WORKSPACE,
    MIME_TYPE_WORKSPACE,
} from "consts"
import { readFileAsUint8Array } from "storage/util"
import { handleNotification } from "drawing/handlers"
import { deflate, inflate } from "pako"
import { board } from "state/board"
import { menu } from "state/menu"

export const handleImportWorkspace = async () => {
    try {
        const workspaceFile = await fileOpen({
            description: FILE_DESCRIPTION_WORKSPACE,
            mimeTypes: [MIME_TYPE_WORKSPACE],
            extensions: [FILE_EXTENSION_WORKSPACE],
            multiple: false,
        })
        if (workspaceFile.name.endsWith(FILE_EXTENSION_WORKSPACE)) {
            const readFile = await readFileAsUint8Array(workspaceFile)

            const serializedBoardState = JSON.parse(
                inflate(readFile, { to: "string" })
            )

            await board.setSerializedState(serializedBoardState)
            menu.closeMainMenu()
        } else {
            handleNotification("ImportMenu.Error.CouldntLoadWorkspace")
        }
    } catch (error) {
        handleNotification("ImportMenu.Error.CouldntLoadWorkspace")
    }
}

export const handleExportWorkspace = async () => {
    const workspaceFile = deflate(JSON.stringify(board.getSerializedState()))

    try {
        // Save to file system
        await fileSave(
            new Blob([workspaceFile], {
                type: MIME_TYPE_WORKSPACE,
            }),
            {
                fileName: FILE_NAME_WORKSPACE,
                description: FILE_DESCRIPTION_WORKSPACE,
                extensions: [FILE_EXTENSION_WORKSPACE],
            }
        )

        menu.closeMainMenu()
    } catch (error) {
        // TODO
        // handleNotification("ImportMenu.Error.CouldntLoadWorkspace")
    }
}
