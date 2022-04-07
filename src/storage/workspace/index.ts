import { fileOpen, fileSave } from "browser-fs-access"
import {
    FILE_DESCRIPTION_WORKSPACE,
    FILE_EXTENSION_WORKSPACE,
    FILE_NAME_WORKSPACE,
    MIME_TYPE_WORKSPACE,
} from "consts"
import { readFileAsUint8Array, startBackgroundJob } from "storage/util"
import { deflate, inflate } from "pako"
import { board } from "state/board"
import { menu } from "state/menu"
import { notification } from "state/notification"

export const handleImportWorkspace = async () => {
    menu.closeMainMenu()
    try {
        await startBackgroundJob("Loading.ImportWorkspace", async () => {
            const workspaceFile = await fileOpen({
                description: FILE_DESCRIPTION_WORKSPACE,
                mimeTypes: [MIME_TYPE_WORKSPACE],
                extensions: [FILE_EXTENSION_WORKSPACE],
                multiple: false,
            })

            if (
                !workspaceFile ||
                !workspaceFile.name.endsWith(FILE_EXTENSION_WORKSPACE)
            ) {
                throw new Error("unknown workspace file format")
            }

            const readFile = await readFileAsUint8Array(workspaceFile)

            const serializedBoardState = JSON.parse(
                inflate(readFile, { to: "string" })
            )

            const state = await board.deserialize(serializedBoardState)
            await board.setState(state)
        })
    } catch (error) {
        notification.create("Notification.ImportWorkspaceFailed")
    }
}

export const handleExportWorkspace = async () => {
    menu.closeMainMenu()
    try {
        await startBackgroundJob("Loading.ExportWorkspace", async () => {
            const workspaceFile = deflate(
                JSON.stringify(board.serialize())
            )
            // Save to file system
            await fileSave(
                new Blob([workspaceFile], {
                    type: MIME_TYPE_WORKSPACE,
                }),
                {
                    fileName: `${FILE_NAME_WORKSPACE}${FILE_EXTENSION_WORKSPACE}`,
                    description: FILE_DESCRIPTION_WORKSPACE,
                    extensions: [FILE_EXTENSION_WORKSPACE],
                }
            )
        })
    } catch (error) {
        notification.create("Notification.ImportWorkspaceFailed")
    }
}
