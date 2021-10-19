import React, { useState } from "react"
import {
    Button,
    DownloadIcon,
    Drawer,
    DrawerContent,
    DrawerTitle,
    IconButton,
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
import {
    handleAddPageOver,
    handleAddPageUnder,
    handleClearPage,
    handleDeleteAllPages,
    handleDeletePage,
} from "drawing/handlers"
import Background from "./background/background"
import Size from "./size/size"
import PdfUpload from "./pdfupload/pdfupload"
import PdfDownload from "./pdfdownload/pdfdownload"

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
                    Page Settings
                </DrawerTitle>
                <DrawerContent>
                    <Background setOpenOther={setOpen} />
                    <Size />
                </DrawerContent>
                <DrawerTitle>
                    <BsFileDiff />
                    Page Actions
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
                    <PdfUpload closePageOptions={close} />
                    <PdfDownload closePageOptions={close} />
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default PageOptions
