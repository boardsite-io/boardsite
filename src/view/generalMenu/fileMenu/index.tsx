import { DownloadIcon, UploadIcon } from "components"
import { FormattedMessage } from "language"
import React from "react"
import {
    CLOSE_GENERAL_MENU,
    OPEN_EXPORT_MENU,
    OPEN_IMPORT_MENU,
} from "redux/menu/menu"
import store from "redux/store"
import { SubMenu } from "../index.styled"
import MenuItem from "../menuItem"

const onClickImport = () => {
    store.dispatch(OPEN_IMPORT_MENU())
    store.dispatch(CLOSE_GENERAL_MENU())
}
const onClickExport = () => {
    store.dispatch(OPEN_EXPORT_MENU())
    store.dispatch(CLOSE_GENERAL_MENU())
}

const FileMenu = () => {
    return (
        <SubMenu>
            <MenuItem
                text={<FormattedMessage id="GeneralMenu.File.Import" />}
                icon={<UploadIcon />}
                onClick={onClickImport}
            />
            <MenuItem
                text={<FormattedMessage id="GeneralMenu.File.Export" />}
                icon={<DownloadIcon />}
                onClick={onClickExport}
            />
        </SubMenu>
    )
}

export default FileMenu
