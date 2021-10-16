import React, { useState } from "react"
import { UploadIcon } from "components"
import { handleDocument } from "redux/drawing/util/handlers"
import {
    InvisibleInput,
    DropZone,
    InfoText,
    ErrorText,
} from "./filedropzone.styled"

interface FileDropZoneProps {
    closeDialog: () => void
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ closeDialog }) => {
    const [hovering, setHovering] = useState<boolean>(false)
    const [invalidInput, setInvalidInput] = useState<boolean>(false)

    const isValidFormat = (file: File) => file.type === "application/pdf"

    const processFile = (file: File) => {
        if (isValidFormat(file)) {
            handleDocument(file).then(() => closeDialog())
            setInvalidInput(false)
        } else {
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
        <>
            <DropZone
                onClick={() => document.getElementById("selectedFile")?.click()}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                $hovering={hovering}>
                <UploadIcon />
                <InfoText>
                    {hovering
                        ? "Release to upload"
                        : "Click to browse files or drag and drop a PDF file here"}
                </InfoText>
                {invalidInput && (
                    <ErrorText>
                        Invalid file type - please upload a valid PDF file
                    </ErrorText>
                )}
            </DropZone>
            <InvisibleInput
                type="file"
                accept="application/pdf"
                id="selectedFile"
                onInput={onInput}
            />
        </>
    )
}

export default FileDropZone
