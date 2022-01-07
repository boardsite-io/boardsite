import React from "react"
import {
    Button,
    DownloadIcon,
    Drawer,
    DrawerContent,
    DrawerTitle,
} from "components"
import PageSettings from "components/pagesettings"
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
    handleDeleteCurrentPage,
    handleChangePageBackground,
} from "drawing/handlers"
import { useCustomSelector } from "hooks"
import store from "redux/store"
import { CLOSE_PAGE_ACTIONS } from "redux/menu/menu"
import PdfUpload from "./pdfupload/pdfupload"
import PdfDownload from "./pdfdownload/pdfdownload"

const PageOptions: React.FC = () => {
    const pageActionsOpen = useCustomSelector(
        (state) => state.menu.pageActionsOpen
    )

    return (
        <Drawer
            position="right"
            open={pageActionsOpen}
            onClose={() => store.dispatch(CLOSE_PAGE_ACTIONS())}>
            <DrawerTitle>
                <BsGear />
                Page Settings
            </DrawerTitle>
            <DrawerContent>
                <Button
                    withIcon
                    onClick={() => {
                        handleChangePageBackground()
                        store.dispatch(CLOSE_PAGE_ACTIONS())
                    }}>
                    <BsFileArrowUp />
                    Apply to page
                </Button>
                <PageSettings />
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
                        store.dispatch(CLOSE_PAGE_ACTIONS())
                    }}>
                    <BsFileArrowUp />
                    New page before
                </Button>
                <Button
                    withIcon
                    onClick={() => {
                        handleAddPageUnder()
                        store.dispatch(CLOSE_PAGE_ACTIONS())
                    }}>
                    <BsFileArrowDown />
                    New page after
                </Button>
                <Button
                    withIcon
                    onClick={() => {
                        handleDeleteCurrentPage()
                        store.dispatch(CLOSE_PAGE_ACTIONS())
                    }}>
                    <BsFileMinus />
                    Delete page
                </Button>
                <Button
                    withIcon
                    onClick={() => {
                        handleClearPage()
                        store.dispatch(CLOSE_PAGE_ACTIONS())
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
                <PdfUpload />
                <PdfDownload />
            </DrawerContent>
        </Drawer>
    )
}

export default PageOptions
