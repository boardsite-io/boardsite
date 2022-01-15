import { FormattedMessage } from "language"
import React, { useCallback, useState } from "react"
import store from "redux/store"
import { handleImportWorkspaceFile } from "redux/workspace"
import { CLOSE_PAGE_ACTIONS, CLOSE_IMPORT_MENU } from "redux/menu/menu"
import {
    Dialog,
    DialogContent,
    DialogOptions,
    Button,
    UploadIcon,
} from "components"
import { useCustomSelector } from "hooks"
import { FILE_EXTENSION_WORKSPACE } from "consts"
import { handleImportPdfFile } from "drawing/pdf"
import { LOAD_BOARD_STATE } from "redux/board/board"
import { BoardState } from "redux/board/board.types"
import { DropZone, ErrorText, InfoText, InvisibleInput } from "./index.styled"

const ImportMenu: React.FC = () => {
    const pdfUploadOpen = useCustomSelector(
        (state) => state.menu.importMenuOpen
    )

    const [hovering, setHovering] = useState<boolean>(false)
    const [invalidInput, setInvalidInput] = useState<boolean>(false)

    const handleClose = useCallback(() => {
        store.dispatch(CLOSE_IMPORT_MENU())
        store.dispatch(CLOSE_PAGE_ACTIONS())
    }, [])

    const processFile = useCallback(async (file: File): Promise<void> => {
        try {
            if (file.type === "application/pdf") {
                await handleImportPdfFile(file)
                setInvalidInput(false)
                handleClose()
                return
            }

            if (file.name.endsWith(FILE_EXTENSION_WORKSPACE)) {
                const partialRootState = await handleImportWorkspaceFile(file)
                if (partialRootState.board) {
                    store.dispatch(
                        LOAD_BOARD_STATE(partialRootState.board as BoardState)
                    )
                    setInvalidInput(false)
                    handleClose()
                    return
                }

                throw new Error("no board state found in file")
            }

            throw new Error("invalid file type")
        } catch {
            setInvalidInput(true)
        }
    }, [])

    const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault() // Prevent file from being opened
        setHovering(true)
    }, [])

    const onDragLeave = useCallback(() => {
        setHovering(false)
    }, [])

    const onDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault() // Prevent file from being opened
            setHovering(false)
            const file = e.dataTransfer.items[0].getAsFile()
            if (file) {
                processFile(file)
            }
        },
        [processFile]
    )

    const onInput = useCallback(
        (e: React.SyntheticEvent) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
                processFile(file)
            }
        },
        [processFile]
    )

    return (
        <Dialog open={pdfUploadOpen} onClose={handleClose}>
            <DialogContent>
                <DropZone
                    onClick={() =>
                        document.getElementById("selectedFile")?.click()
                    }
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    $hovering={hovering}
                >
                    <UploadIcon />
                    <InfoText>
                        {hovering ? (
                            <FormattedMessage id="ImportMenu.InfoText.Hovering" />
                        ) : (
                            <FormattedMessage id="ImportMenu.InfoText.NotHovering" />
                        )}
                    </InfoText>
                    {invalidInput && (
                        <ErrorText>
                            <FormattedMessage id="ImportMenu.ErrorText" />
                        </ErrorText>
                    )}
                </DropZone>
                <InvisibleInput
                    type="file"
                    accept={`application/pdf, ${FILE_EXTENSION_WORKSPACE}`}
                    id="selectedFile"
                    onInput={onInput}
                />
            </DialogContent>
            <DialogOptions>
                <Button onClick={handleClose}>
                    <FormattedMessage id="ImportMenu.Close" />
                </Button>
            </DialogOptions>
        </Dialog>
    )
}

export default ImportMenu
