import { FormattedMessage } from "language"
import React from "react"
import { HorizontalRule } from "components"
import { handleAddPageUnder, handleDeleteAllPages } from "drawing/handlers"
import {
    handleExportPdf,
    handleExportWorkspace,
    handleImportPdf,
    handleImportWorkspace,
} from "drawing/fileManagement"
import { menu } from "state/menu"
import { SubMenuWrap } from "../../index.styled"
import MenuItem from "../../MenuItem"

const onClickNew = () => {
    handleDeleteAllPages()
    handleAddPageUnder()
    menu.closeMainMenu()
}

const onClickOpen = async () => {
    handleImportWorkspace()
}

const onClickSave = () => {
    handleExportWorkspace()
}

const onClickImportPdf = async () => {
    handleImportPdf()
}

const onClickExportPdf = () => {
    handleExportPdf()
}

const FileMenu = () => {
    return (
        <SubMenuWrap>
            <MenuItem
                text={<FormattedMessage id="Menu.General.File.New" />}
                onClick={onClickNew}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.General.File.Open" />}
                onClick={onClickOpen}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.General.File.Save" />}
                onClick={onClickSave}
            />
            <HorizontalRule />
            <MenuItem
                text={<FormattedMessage id="Menu.General.File.ImportPdf" />}
                onClick={onClickImportPdf}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.General.File.ExportPdf" />}
                onClick={onClickExportPdf}
            />
        </SubMenuWrap>
    )
}

export default FileMenu
