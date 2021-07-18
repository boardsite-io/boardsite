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
    TextField,
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
import { getPDFfromForm, loadNewPDF } from "../../../drawing/page"

const PageOptions: React.FC = () => {
    const [open, setOpen] = useState(false)
    const [openFileDiag, setOpenFileDiag] = useState(false)
    const [fileErr, setFileErr] = useState(false)

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
                            tabIndex={0}
                            className="cover"
                            onClick={() => setOpen(false)}
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
                    <TextField
                        type="file"
                        error={fileErr}
                        onInput={(e: React.SyntheticEvent) =>
                            (async () => {
                                const ev = e.target as HTMLInputElement
                                if (ev.files && ev.files[0]) {
                                    const fileData = await getPDFfromForm(
                                        ev.files[0]
                                    )
                                    await loadNewPDF(fileData)
                                    setOpenFileDiag(false)
                                    setFileErr(false)
                                }
                            })().catch(() => setFileErr(true))
                        }
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

export default PageOptions
