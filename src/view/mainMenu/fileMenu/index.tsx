import { Divider, DownloadIcon, UploadIcon } from "components"
import { FILE_EXTENSION_WORKSPACE } from "consts"
import { handleProcessFileImport } from "drawing/attachment"
import { handleAddPageUnder, handleDeleteAllPages } from "drawing/handlers"
import { FormattedMessage } from "language"
import React from "react"
import {
    CLOSE_MAIN_MENU,
    OPEN_EXPORT_MENU,
    OPEN_IMPORT_MENU,
} from "redux/menu/menu"
import store from "redux/store"
import { exportWorkspace } from "view/exportMenu"
import { SubMenuWrap } from "../index.styled"
import MenuItem from "../menuItem"
import { InvisibleInput } from "./index.styled"

const onClickNew = () => {
    handleDeleteAllPages()
    handleAddPageUnder()
    store.dispatch(CLOSE_MAIN_MENU())
}
const onClickImport = () => {
    store.dispatch(OPEN_IMPORT_MENU())
    store.dispatch(CLOSE_MAIN_MENU())
}
const onClickExport = () => {
    store.dispatch(OPEN_EXPORT_MENU())
    store.dispatch(CLOSE_MAIN_MENU())
}
const onInput = async (e: React.SyntheticEvent) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
        const errorMessage = await handleProcessFileImport(file)

        if (errorMessage === undefined) {
            store.dispatch(CLOSE_MAIN_MENU())
        }
    }
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
                onClick={() => document.getElementById("selectedFile")?.click()}
            />
            <InvisibleInput
                type="file"
                accept={`${FILE_EXTENSION_WORKSPACE}`}
                id="selectedFile"
                onInput={onInput}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.General.File.Save" />}
                onClick={() => exportWorkspace("workspace")}
            />
            {/* <MenuItem
                text={<FormattedMessage id="Menu.General.File.SaveAs" />}
                onClick={() => exportWorkspace("CUSTOMISABLE_NAME")}
            /> */}
            <Divider />
            <MenuItem
                text={<FormattedMessage id="Menu.General.File.Import" />}
                icon={<UploadIcon />}
                onClick={onClickImport}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.General.File.Export" />}
                icon={<DownloadIcon />}
                onClick={onClickExport}
            />
        </SubMenuWrap>
    )
}

export default FileMenu
