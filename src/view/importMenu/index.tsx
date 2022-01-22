import { FormattedMessage, IntlMessageKeys, intlTags } from "language"
import React, { useCallback, useState } from "react"
import store from "redux/store"
import { CLOSE_GENERAL_MENU, CLOSE_IMPORT_MENU } from "redux/menu/menu"
import {
    Dialog,
    DialogContent,
    DialogOptions,
    Button,
    UploadIcon,
} from "components"
import { useCustomSelector } from "hooks"
import { FILE_EXTENSION_WORKSPACE } from "consts"
import { handleProcessFileImport } from "drawing/attachment"
import {
    DropZone,
    ErrorText,
    InfoText,
    InvisibleInput,
    SupportedTypesText,
} from "./index.styled"

const ImportMenu: React.FC = () => {
    const pdfUploadOpen = useCustomSelector(
        (state) => state.menu.importMenuOpen
    )

    const [hovering, setHovering] = useState<boolean>(false)
    const [importError, setImportError] = useState<IntlMessageKeys | undefined>(
        undefined
    )

    const handleClose = useCallback(() => {
        store.dispatch(CLOSE_IMPORT_MENU())
        store.dispatch(CLOSE_GENERAL_MENU())

        // Wait for closing animation and then clear the error message
        setTimeout(() => {
            setImportError(undefined)
        }, 500)
    }, [])

    const processFile = useCallback(async (file: File): Promise<void> => {
        try {
            const message = await handleProcessFileImport(file)

            if (message) {
                setImportError(message)
            } else {
                handleClose()
            }
        } catch (err) {
            // Default to InvalidFileType error message
            setImportError("ImportMenu.Error.InvalidFileType")
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
                        <FormattedMessage
                            id={
                                hovering
                                    ? "ImportMenu.InfoText.Hovering"
                                    : "ImportMenu.InfoText.NotHovering"
                            }
                        />
                    </InfoText>
                </DropZone>
                <InvisibleInput
                    type="file"
                    accept={`application/pdf, ${FILE_EXTENSION_WORKSPACE}`}
                    id="selectedFile"
                    onInput={onInput}
                />
                {importError && (
                    <ErrorText>
                        <FormattedMessage id={importError} />
                    </ErrorText>
                )}
                <SupportedTypesText>
                    <FormattedMessage
                        id="ImportMenu.SupportedTypes"
                        values={intlTags}
                    />
                </SupportedTypesText>
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
