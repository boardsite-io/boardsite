import React, { useState } from "react"
import {
    Button,
    DownloadIcon,
    Drawer,
    DrawerContent,
    DrawerTitle,
    NumberInput,
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
import { useCustomDispatch, useCustomSelector } from "redux/hooks"
import { SET_PAGE_HEIGHT, SET_PAGE_WIDTH } from "redux/slice/boardcontrol"
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
    const dispatch = useCustomDispatch()
    const [open, setOpen] = useState(false)
    const close = () => setOpen(false)
    const { width: pageWidth, height: pageHeight } = useCustomSelector(
        (state) => state.boardControl.pageSettings
    )

    const minWidth = 1
    const maxWidth = 1000
    const minHeight = 1
    const maxHeight = 2000

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const widthValue = parseInt(e.target.value, 10)
        if (widthValue <= maxWidth && widthValue >= minWidth) {
            dispatch(SET_PAGE_WIDTH(e.target.value))
        }
    }
    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const heightValue = parseInt(e.target.value, 10)
        if (heightValue <= maxHeight && heightValue >= minHeight) {
            dispatch(SET_PAGE_HEIGHT(e.target.value))
        }
    }

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
                    <NumberInput
                        label="Width"
                        value={pageWidth}
                        onChange={handleWidthChange}
                        step={1}
                        min={minWidth}
                        max={maxWidth}
                    />
                    <NumberInput
                        label="Height"
                        value={pageHeight}
                        onChange={handleHeightChange}
                        step={1}
                        min={minHeight}
                        max={maxHeight}
                    />
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
