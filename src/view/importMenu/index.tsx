import { FormattedMessage } from "language"
import React, { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogOptions,
    Button,
    UploadIcon,
} from "components"
import { useCustomSelector } from "hooks"
import store from "redux/store"
import { CLOSE_PAGE_ACTIONS, CLOSE_IMPORT_MENU } from "redux/menu/menu"
import { handleImportFile } from "drawing/pdf"
import { DropZone, ErrorText, InfoText, InvisibleInput } from "./index.styled"

const PdfUpload: React.FC = () => {
    const pdfUploadOpen = useCustomSelector(
        (state) => state.menu.importMenuOpen
    )

    const handleClose = () => {
        store.dispatch(CLOSE_IMPORT_MENU())
        store.dispatch(CLOSE_PAGE_ACTIONS())
    }

    const [hovering, setHovering] = useState<boolean>(false)
    const [invalidInput, setInvalidInput] = useState<boolean>(false)

    const isValidFormat = (file: File) => file.type === "application/pdf"

    const processFile = async (file: File) => {
        try {
            if (!isValidFormat(file)) {
                throw new Error("invalid file type")
            }

            await handleImportFile(file)
            setInvalidInput(false)
            handleClose()
        } catch {
            setInvalidInput(true)
        }
    }

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault() // Prevent file from being opened
        setHovering(true)
    }

    const onDragLeave = () => {
        setHovering(false)
    }

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault() // Prevent file from being opened
        setHovering(false)
        const file = e.dataTransfer.items[0].getAsFile()
        if (file) {
            processFile(file)
        }
    }

    const onInput = (e: React.SyntheticEvent) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
            processFile(file)
        }
    }

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
                    $hovering={hovering}>
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
                    accept="application/pdf"
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

export default PdfUpload
