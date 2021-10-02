import React, { useState } from "react"
import {
    Button,
    DownloadIcon,
    Drawer,
    DrawerContent,
    DrawerTitle,
} from "components"
import {
    BsFileMinus,
    BsFileRuled,
    BsTrash,
    BsFileArrowDown,
    BsFileArrowUp,
    BsFileDiff,
    BsGear,
} from "react-icons/bs"
import Background from "./background/background"
import IconButton from "../../../components/iconbutton/iconbutton"
import {
    handleAddPageOver,
    handleAddPageUnder,
    handleClearPage,
    handleDeleteAllPages,
    handleDeletePage,
    handleExportDocument,
} from "../../../drawing/handlers"
import UploadPDFButton from "../uploadpdf/uploadPDF"

const PageOptions: React.FC = () => {
    const [open, setOpen] = useState(false)
    const close = () => setOpen(false)
    return (
        <>
            <IconButton onClick={() => setOpen(true)}>
                <BsFileDiff />
            </IconButton>
            <Drawer position="right" open={open} onClose={close}>
                <DrawerTitle>
                    <BsGear />
                    Page Background
                </DrawerTitle>
                <DrawerContent>
                    <Background setOpenOther={setOpen} />
                </DrawerContent>
                <DrawerTitle>
                    <BsFileDiff />
                    Page Options
                </DrawerTitle>
                <DrawerContent>
                    <Button
                        withIcon
                        onClick={() => {
                            handleAddPageOver()
                            close()
                        }}>
                        <BsFileArrowUp />
                        New page before
                    </Button>
                    <Button
                        withIcon
                        onClick={() => {
                            handleAddPageUnder()
                            close()
                        }}>
                        <BsFileArrowDown />
                        New page after
                    </Button>
                    <Button
                        withIcon
                        onClick={() => {
                            handleDeletePage()
                            close()
                        }}>
                        <BsFileMinus />
                        Delete page
                    </Button>
                    <Button
                        withIcon
                        onClick={() => {
                            handleClearPage()
                            close()
                        }}>
                        <BsFileRuled />
                        Clear page
                    </Button>
                    <Button withIcon onClick={handleDeleteAllPages}>
                        <BsTrash />
                        Delete all pages
                    </Button>
                </DrawerContent>
                <DrawerTitle>
                    <DownloadIcon />
                    Import / Export PDFs
                </DrawerTitle>
                <DrawerContent>
                    <UploadPDFButton closePageOptions={close} />
                    <Button
                        withIcon
                        onClick={() => {
                            handleExportDocument()
                            close()
                        }}>
                        <DownloadIcon />
                        Export as PDF
                    </Button>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default PageOptions
