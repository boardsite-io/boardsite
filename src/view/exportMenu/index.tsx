import { FormattedMessage } from "language"
import React from "react"
import {
    Dialog,
    DialogContent,
    DialogOptions,
    Button,
    DialogTitle,
} from "components"
import { useCustomSelector } from "hooks"
import store from "redux/store"
import { CLOSE_PAGE_ACTIONS, CLOSE_EXPORT_MENU } from "redux/menu/menu"
import { handleExportAsPdf } from "drawing/pdf"
import { saveWorkspace } from "redux/workspace"
import download from "downloadjs"
import { FILE_EXTENSION_WORKSPACE } from "consts"
import { ExportDescription, ExportOptions } from "./index.styled"

const handleClose = () => {
    store.dispatch(CLOSE_EXPORT_MENU())
    store.dispatch(CLOSE_PAGE_ACTIONS())
}

const exportAsPdf = () => {
    handleExportAsPdf()
    handleClose()
}

const exportWorkspace = () => {
    const fileName = `TODO${FILE_EXTENSION_WORKSPACE}`
    const file = saveWorkspace(store.getState())
    download(file, fileName)
    handleClose()
}

const ExportMenu: React.FC = () => {
    const exportMenuOpen = useCustomSelector(
        (state) => state.menu.exportMenuOpen
    )

    return (
        <Dialog open={exportMenuOpen} onClose={handleClose}>
            <DialogTitle>
                <FormattedMessage id="ExportMenu.Title" />
            </DialogTitle>
            <DialogContent>
                <ExportDescription>
                    <FormattedMessage id="ExportMenu.Description" />
                </ExportDescription>
                <ExportOptions>
                    <Button onClick={exportWorkspace}>
                        <FormattedMessage id="ExportMenu.Button.Workspace" />
                    </Button>
                    <Button onClick={exportAsPdf}>
                        <FormattedMessage id="ExportMenu.Button.Pdf" />
                    </Button>
                </ExportOptions>
            </DialogContent>
            <DialogOptions>
                <Button onClick={handleClose}>
                    <FormattedMessage id="ExportMenu.Close" />
                </Button>
            </DialogOptions>
        </Dialog>
    )
}

export default ExportMenu
