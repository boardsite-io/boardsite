import React from "react"
import {
    Button,
    DownloadIcon,
    Drawer,
    DrawerContent,
    DrawerTitle,
    UploadIcon,
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
import {
    CLOSE_PAGE_ACTIONS,
    OPEN_EXPORT_MENU,
    OPEN_IMPORT_MENU,
} from "redux/menu/menu"

const onClickApplyToPage = () => {
    handleChangePageBackground()
    store.dispatch(CLOSE_PAGE_ACTIONS())
}
const onClickNewPageBefore = () => {
    handleAddPageOver()
    store.dispatch(CLOSE_PAGE_ACTIONS())
}
const onClickNewPageAfter = () => {
    handleAddPageUnder()
    store.dispatch(CLOSE_PAGE_ACTIONS())
}
const onClickDeletePage = () => {
    handleDeleteCurrentPage()
    store.dispatch(CLOSE_PAGE_ACTIONS())
}
const onClickClearPage = () => {
    handleClearPage()
    store.dispatch(CLOSE_PAGE_ACTIONS())
}
const onClickDeleteAllPages = () => {
    handleDeleteAllPages(true)
}
const onClickImport = () => {
    store.dispatch(OPEN_IMPORT_MENU())
}
const onClickExport = () => {
    store.dispatch(OPEN_EXPORT_MENU())
}
const onClose = () => {
    store.dispatch(CLOSE_PAGE_ACTIONS())
}

const PageMenu: React.FC = () => {
    const pageActionsOpen = useCustomSelector(
        (state) => state.menu.pageActionsOpen
    )

    return (
        <Drawer position="right" open={pageActionsOpen} onClose={onClose}>
            <DrawerTitle>
                <BsGear />
                Page Settings
            </DrawerTitle>
            <DrawerContent>
                <Button withIcon onClick={onClickApplyToPage}>
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
                <Button withIcon onClick={onClickNewPageBefore}>
                    <BsFileArrowUp />
                    New page before
                </Button>
                <Button withIcon onClick={onClickNewPageAfter}>
                    <BsFileArrowDown />
                    New page after
                </Button>
                <Button withIcon onClick={onClickDeletePage}>
                    <BsFileMinus />
                    Delete page
                </Button>
                <Button withIcon onClick={onClickClearPage}>
                    <BsFileRuled />
                    Clear page
                </Button>
                <Button withIcon onClick={onClickDeleteAllPages}>
                    <BsTrash />
                    Delete all pages
                </Button>
            </DrawerContent>
            <DrawerTitle>
                <DownloadIcon />
                Import / Export Menus
            </DrawerTitle>
            <DrawerContent>
                <Button withIcon onClick={onClickImport}>
                    <UploadIcon />
                    Open import menu
                </Button>
                <Button withIcon onClick={onClickExport}>
                    <DownloadIcon />
                    Open export menu
                </Button>
            </DrawerContent>
        </Drawer>
    )
}

export default PageMenu
