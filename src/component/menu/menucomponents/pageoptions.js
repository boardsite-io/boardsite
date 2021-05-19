import React, { useState } from "react"
import {
    BsFileMinus,
    BsFileRuled,
    BsTrash,
    BsFileArrowDown,
    BsFileArrowUp,
    BsFileDiff,
    BsUpload,
} from "react-icons/bs"
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Input,
} from "@material-ui/core"
import {
    handleAddPageOver,
    handleAddPageUnder,
    handleClearPage,
    handleDeleteAllPages,
    handleDeletePage,
} from "../../../drawing/handlers"
import "../../../css/menucomponents/pageoptions.css"
import PageSettings from "./pagesettings"
import { loadNewPDF } from "../../../drawing/page"

export default function PageOptions() {
    const [open, setOpen] = useState(false)
    const [openFileDiag, setOpenFileDiag] = useState(false)

    return (
        <div className="pageoptions-wrap">
            <button
                type="button"
                id="icon-button"
                onClick={() => setOpen(true)}>
                <BsFileDiff id="icon" />
            </button>
            <button
                type="button"
                id="icon-button"
                onClick={() => setOpenFileDiag(true)}>
                <BsUpload id="icon" />
            </button>
            {
                // Palette Popup
                open ? (
                    <div className="popup">
                        <div
                            role="button"
                            tabIndex="0"
                            className="cover"
                            onClick={() => setOpen(false)}
                            onKeyPress={() => {}}
                        />
                        <div className="pageoptions">
                            <button
                                type="button"
                                id="icon-button"
                                onClick={handleAddPageOver}>
                                <BsFileArrowUp id="icon" />
                            </button>
                            <button
                                type="button"
                                id="icon-button"
                                onClick={handleAddPageUnder}>
                                <BsFileArrowDown id="icon" />
                            </button>
                            <button
                                type="button"
                                id="icon-button"
                                onClick={() => handleDeletePage()}>
                                <BsFileMinus id="icon" />
                            </button>
                            <button
                                type="button"
                                id="icon-button"
                                onClick={() => handleClearPage()}>
                                <BsFileRuled id="icon" />
                            </button>
                            <button
                                type="button"
                                id="icon-button"
                                onClick={handleDeleteAllPages}>
                                <BsTrash id="icon" />
                            </button>
                            <PageSettings setOpenOther={setOpen} />
                        </div>
                    </div>
                ) : null
            }
            <Dialog
                maxWidth="xs"
                fullWidth
                open={openFileDiag}
                onClose={() => setOpenFileDiag(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle>Import File</DialogTitle>
                <DialogContent>
                    <Input
                        type="file"
                        onInput={(e) => {
                            loadNewPDF(e.target.files[0])
                            setOpenFileDiag(false)
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenFileDiag(false)}
                        color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
