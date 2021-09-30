import React, { useState } from "react"
import { Popup } from "components"
import {
    BsFileMinus,
    BsFileRuled,
    BsTrash,
    BsFileArrowDown,
    BsFileArrowUp,
    BsFileDiff,
} from "react-icons/bs"
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
import FileDropButton from "../filedrop/filedrop"

const PageOptions: React.FC = () => {
    const [open, setOpen] = useState(false)
    const close = () => setOpen(false)
    return (
        <PageOptionsWrapper>
            <IconButton onClick={() => setOpen(true)}>
                <BsFileDiff id="icon" />
            </IconButton>
            <Popup open={open} onClose={close}>
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
                    <FileDropButton closePageOptions={close} />
                    <PageSettings setOpenOther={setOpen} />
                    <IconButton onClick={handleDeleteAllPages}>
                        <BsTrash id="icon" />
                    </IconButton>
                </PageOptionsWrapperInner>
            </Popup>
        </PageOptionsWrapper>
    )
}

export default PageOptions
