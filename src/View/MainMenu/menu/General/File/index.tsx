import { FormattedMessage } from "language"
import React from "react"
import { HorizontalRule } from "components"
import { useGState } from "state"
import { online } from "state/online"
import { handleNewWorkspace } from "drawing/handlers"
import { handleExportWorkspace, handleImportWorkspace } from "storage/workspace"
import { handleExportPdf, handleImportPdf } from "storage/pdf"
import { SubMenuWrap } from "../../../index.styled"
import MenuItem from "../../../MenuItem"

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
    useGState("Session")

    return (
        <SubMenuWrap>
            <MenuItem
                text={<FormattedMessage id="Menu.General.File.New" />}
                onClick={handleNewWorkspace}
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
                disabled={online.isConnected() && !online.isAuthorized()}
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
