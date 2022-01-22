import {
    Divider,
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
import {
    CLOSE_GENERAL_MENU,
    GeneralMenuState,
    SET_GENERAL_MENU,
} from "redux/menu/menu"
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
const onClickPageStyle = () => {
    store.dispatch(SET_GENERAL_MENU(GeneralMenuState.PageStyle))
}
const onClickPageSize = () => {
    store.dispatch(SET_GENERAL_MENU(GeneralMenuState.PageSize))
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
            <Divider />
            <MenuItem
                warning
                text={<FormattedMessage id="GeneralMenu.Page.DeleteAll" />}
                icon={<PageDeleteAllIcon />}
                onClick={onClickDeleteAllPages}
            />
            <Divider />
            <MenuItem
                text={<FormattedMessage id="GeneralMenu.Page.PageStyle" />}
                onClick={onClickPageStyle}
            />
            <MenuItem
                text={<FormattedMessage id="GeneralMenu.Page.PageSize" />}
                onClick={onClickPageSize}
            />
        </SubMenu>
    )
}
export default PageMenu
