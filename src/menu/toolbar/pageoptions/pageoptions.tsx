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
import {
    MAX_PAGE_WIDTH,
    MIN_PAGE_WIDTH,
    MAX_PAGE_HEIGHT,
    MIN_PAGE_HEIGHT,
} from "../../../constants"
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

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const widthValue = parseInt(e.target.value, 10)
        if (widthValue > MAX_PAGE_WIDTH) {
            e.target.value = MAX_PAGE_WIDTH.toString()
        } else if (widthValue < MIN_PAGE_WIDTH) {
            // do something
        } else {
            dispatch(SET_PAGE_WIDTH(parseInt(e.target.value, 10)))
        }
    }
    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const heightValue = parseInt(e.target.value, 10)
        if (heightValue > MAX_PAGE_HEIGHT) {
            e.target.value = MAX_PAGE_HEIGHT.toString()
        } else if (heightValue < MIN_PAGE_HEIGHT) {
            // do something
        } else {
            dispatch(SET_PAGE_HEIGHT(parseInt(e.target.value, 10)))
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
                    Page Settings
                </DrawerTitle>
                <DrawerContent>
                    <Background setOpenOther={setOpen} />
                    <NumberInput
                        label="Width"
                        placeholder={pageWidth.toString()}
                        onChange={handleWidthChange}
                        step={1}
                        min={MIN_PAGE_WIDTH}
                        max={MAX_PAGE_WIDTH}
                    />
                    <NumberInput
                        label="Height"
                        placeholder={pageHeight.toString()}
                        onChange={handleHeightChange}
                        step={1}
                        min={MIN_PAGE_HEIGHT}
                        max={MAX_PAGE_HEIGHT}
                    />
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
