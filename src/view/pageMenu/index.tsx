import { FormattedMessage } from "language"
import React from "react"
import store from "redux/store"
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
                <FormattedMessage id="PageMenu.PageSettings.Title" />
            </DrawerTitle>
            <DrawerContent>
                <Button withIcon onClick={onClickApplyToPage}>
                    <BsFileArrowUp />
                    <FormattedMessage id="PageMenu.PageSettings.ApplyToPage" />
                </Button>
                <PageSettings />
            </DrawerContent>
            <DrawerTitle>
                <BsFileDiff />
                <FormattedMessage id="PageMenu.PageActions.Title" />
            </DrawerTitle>
            <DrawerContent>
                <Button withIcon onClick={onClickNewPageBefore}>
                    <BsFileArrowUp />
                    <FormattedMessage id="PageMenu.PageActions.NewBefore" />
                </Button>
                <Button withIcon onClick={onClickNewPageAfter}>
                    <BsFileArrowDown />
                    <FormattedMessage id="PageMenu.PageActions.NewAfter" />
                </Button>
                <Button withIcon onClick={onClickDeletePage}>
                    <BsFileMinus />
                    <FormattedMessage id="PageMenu.PageActions.Delete" />
                </Button>
                <Button withIcon onClick={onClickClearPage}>
                    <BsFileRuled />
                    <FormattedMessage id="PageMenu.PageActions.Clear" />
                </Button>
                <Button withIcon onClick={onClickDeleteAllPages}>
                    <BsTrash />
                    <FormattedMessage id="PageMenu.PageActions.DeleteAll" />
                </Button>
            </DrawerContent>
            <DrawerTitle>
                <DownloadIcon />
                <FormattedMessage id="PageMenu.ImportExport.Title" />
            </DrawerTitle>
            <DrawerContent>
                <Button withIcon onClick={onClickImport}>
                    <UploadIcon />
                    <FormattedMessage id="PageMenu.ImportExport.OpenImport" />
                </Button>
                <Button withIcon onClick={onClickExport}>
                    <DownloadIcon />
                    <FormattedMessage id="PageMenu.ImportExport.OpenExport" />
                </Button>
            </DrawerContent>
        </Drawer>
    )
}

export default PageMenu
