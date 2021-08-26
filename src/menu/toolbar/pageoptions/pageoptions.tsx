import React, { useState } from "react"
import { Popup } from "@components"
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
import PageSettings from "../pagesettings/pagesettings"
import IconButton from "../../../components/iconbutton/iconbutton"
import {
    PageOptionsWrapper,
    PageOptionsWrapperInner,
} from "./pageoptions.styled"
import {
    handleAddPageOver,
    handleAddPageUnder,
    handleClearPage,
    handleDeleteAllPages,
    handleDeletePage,
} from "../../../drawing/handlers"

const PageOptions: React.FC = () => {
    const [open, setOpen] = useState(false)
    const [openFileDiag, setOpenFileDiag] = useState(false)
    const [fileErr, setFileErr] = useState(false)

    return (
        <PageOptionsWrapper>
            <IconButton onClick={() => setOpen(true)}>
                <BsFileDiff id="icon" />
            </IconButton>
            <Popup open={open} onClose={() => setOpen(false)}>
                <PageOptionsWrapperInner>
                    <IconButton onClick={handleAddPageOver}>
                        <BsFileArrowUp id="icon" />
                    </IconButton>
                    <IconButton onClick={handleAddPageUnder}>
                        <BsFileArrowDown id="icon" />
                    </IconButton>
                    <IconButton onClick={() => handleDeletePage()}>
                        <BsFileMinus id="icon" />
                    </IconButton>
                    <IconButton onClick={() => handleClearPage()}>
                        <BsFileRuled id="icon" />
                    </IconButton>
                    <IconButton onClick={handleDeleteAllPages}>
                        <BsTrash id="icon" />
                    </IconButton>
                    <PageSettings setOpenOther={setOpen} />
                </PageOptionsWrapperInner>
            </Popup>
            <IconButton onClick={() => setOpenFileDiag(true)}>
                <BsUpload id="icon" />
            </IconButton>
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
                        onInput={undefined}
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
        </PageOptionsWrapper>
    )
}

export default PageOptions
