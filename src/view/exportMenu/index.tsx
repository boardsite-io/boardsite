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
    const fileName = "TODO"
    saveWorkspace(fileName, store.getState().board)
    handleClose()
}

const ExportMenu: React.FC = () => {
    const exportMenuOpen = useCustomSelector(
        (state) => state.menu.exportMenuOpen
    )

    return (
        <Dialog open={exportMenuOpen} onClose={handleClose}>
            <DialogTitle>Export Options</DialogTitle>
            <DialogContent>
                <ExportDescription>
                    Please select your preferred export format. If you would
                    like to be able to restore your session, please choose
                    WORKSPACE.
                </ExportDescription>
                <ExportOptions>
                    <Button onClick={exportWorkspace}>Workspace</Button>
                    <Button onClick={exportAsPdf}>Pdf</Button>
                </ExportOptions>
            </DialogContent>
            <DialogOptions>
                <Button onClick={handleClose}>Close</Button>
            </DialogOptions>
        </Dialog>
    )
}

export default ExportMenu
