import React, { useState } from "react"
import { TextField } from "@material-ui/core"
import { handleDocument } from "drawing/handlers"
import {
    StyledDivNoTouch,
    StyledFileDropZone,
    StyledIcon,
    StyledSubtitle,
    StyledTitle,
} from "./filedrop.styled"

interface FileDropZoneProps {
    closeDialog: () => void
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ closeDialog }) => {
    const [hovering, setHovering] = useState<boolean>(false)

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        setHovering(false)
        // Prevent default behavior (Prevent file from being opened)
        e.preventDefault()

        const file = e.dataTransfer.items[0].getAsFile()
        if (file) {
            handleDocument(file).then(() => closeDialog())
        }
        // if (e.dataTransfer.items) {
        //     // Use DataTransferItemList interface to access the file(s)
        //     for (var i = 0; i < e.dataTransfer.items.length; i++) {
        //         // If dropped items aren't files, reject them
        //         if (e.dataTransfer.items[i].kind === "file") {
        //             var file = e.dataTransfer.items[i].getAsFile()
        //             console.log("... file[" + i + "].name = " + file.name)
        //         }
        //     }
        // } else {
        //     // Use DataTransfer interface to access the file(s)
        //     for (var i = 0; i < e.dataTransfer.files.length; i++) {
        //         console.log(
        //             "... file[" + i + "].name = " + e.dataTransfer.files[i].name
        //         )
        //     }
        // }
    }

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        setHovering(true)
        // Prevent default behavior (Prevent file from being opened)
        e.preventDefault()
    }

    const onDragLeave = () => {
        setHovering(false)
    }
    const onInput = (e: React.SyntheticEvent) => {
        const target = e.target as HTMLInputElement
        if (target.files && target.files[0]) {
            handleDocument(target.files[0]).then(() => closeDialog())
        }
    }

    return (
        <>
            <StyledFileDropZone
                onClick={() => document.getElementById("selectedFile")?.click()}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                $hovering={hovering}>
                <StyledDivNoTouch>
                    <StyledIcon />
                    <StyledTitle>{hovering ? "" : "Browse Files"}</StyledTitle>
                    <StyledSubtitle>
                        {hovering ? "" : "Drag and drop files here"}
                    </StyledSubtitle>
                </StyledDivNoTouch>
            </StyledFileDropZone>
            <TextField
                type="file"
                id="selectedFile"
                style={{ display: "none" }}
                onInput={onInput}
            />
        </>
    )
}

export default FileDropZone
