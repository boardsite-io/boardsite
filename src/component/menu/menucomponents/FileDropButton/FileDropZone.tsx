import React, { useRef, useState } from "react"
import {
    StyledDivNoTouch,
    StyledFileDropZone,
    StyledIcon,
    StyledSubtitle,
    StyledTitle,
} from "./FileDropZone.styled"

const FileDropZone: React.FC = () => {
    const [hovering, setHovering] = useState<boolean>(false)
    const fileRef = useRef<HTMLInputElement>(null)

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        setHovering(false)
        // Prevent default behavior (Prevent file from being opened)
        e.preventDefault()

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
    const onSubmit = () => {
        console.log(fileRef?.current?.files)
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
                    <StyledTitle>Browse Files</StyledTitle>
                    <StyledSubtitle>Drag and drop files here</StyledSubtitle>
                </StyledDivNoTouch>
            </StyledFileDropZone>
            <input
                type="file"
                id="selectedFile"
                style={{ display: "none" }}
                onChange={onSubmit}
            />
        </>
    )
}

export default FileDropZone
