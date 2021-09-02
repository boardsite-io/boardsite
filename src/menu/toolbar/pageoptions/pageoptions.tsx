import React, { useState } from "react"
import { Popup } from "@components"
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

const PageOptions: React.FC = () => {
    const [open, setOpen] = useState(false)

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
        </PageOptionsWrapper>
    )
}

export default PageOptions
