import {
    PageAboveIcon,
    PageBelowIcon,
    PageClearIcon,
    PageDeleteAllIcon,
    PageDeleteIcon,
} from "components"
import {
    handleAddPageOver,
    handleAddPageUnder,
    handleClearPage,
    handleDeleteAllPages,
    handleDeleteCurrentPage,
} from "drawing/handlers"
import { FormattedMessage } from "language"
import React from "react"
import { BsGear } from "react-icons/bs"
import { CLOSE_GENERAL_MENU, OPEN_PAGE_SETTINGS } from "redux/menu/menu"
import store from "redux/store"
import { SubMenu } from "../index.styled"
import MenuItem from "../menuItem"

const onClickNewPageBefore = () => {
    handleAddPageOver()
    store.dispatch(CLOSE_GENERAL_MENU())
}
const onClickNewPageAfter = () => {
    handleAddPageUnder()
    store.dispatch(CLOSE_GENERAL_MENU())
}
const onClickDeletePage = () => {
    handleDeleteCurrentPage()
    store.dispatch(CLOSE_GENERAL_MENU())
}
const onClickClearPage = () => {
    handleClearPage()
    store.dispatch(CLOSE_GENERAL_MENU())
}
const onClickDeleteAllPages = () => {
    handleDeleteAllPages(true)
}
const onClickPageSettings = () => {
    store.dispatch(OPEN_PAGE_SETTINGS())
    store.dispatch(CLOSE_GENERAL_MENU())
}

const PageMenu = () => {
    return (
        <SubMenu>
            <MenuItem
                text={<FormattedMessage id="GeneralMenu.Page.NewBefore" />}
                icon={<PageAboveIcon />}
                onClick={onClickNewPageBefore}
            />
            <MenuItem
                text={<FormattedMessage id="GeneralMenu.Page.NewAfter" />}
                icon={<PageBelowIcon />}
                onClick={onClickNewPageAfter}
            />
            <MenuItem
                text={<FormattedMessage id="GeneralMenu.Page.Clear" />}
                icon={<PageClearIcon />}
                onClick={onClickClearPage}
            />
            <MenuItem
                text={<FormattedMessage id="GeneralMenu.Page.Delete" />}
                icon={<PageDeleteIcon />}
                onClick={onClickDeletePage}
            />
            <MenuItem
                text={<FormattedMessage id="GeneralMenu.Page.DeleteAll" />}
                icon={<PageDeleteAllIcon />}
                onClick={onClickDeleteAllPages}
            />
            <MenuItem
                text={<FormattedMessage id="GeneralMenu.Page.Settings" />}
                icon={<BsGear id="transitory-icon" />}
                onClick={onClickPageSettings}
            />
        </SubMenu>
    )
}
export default PageMenu
