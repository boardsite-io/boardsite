import {
    Divider,
    PageAboveIcon,
    PageBelowIcon,
    PageClearIcon,
    // PageDeleteAllIcon,
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
    CLOSE_MAIN_MENU,
    MainSubMenuState,
    SET_MAIN_SUB_MENU,
} from "redux/menu/menu"
import store from "redux/store"
import { SubMenuWrap } from "../index.styled"
import MenuItem from "../menuItem"

const onClickNewPageBefore = () => {
    handleAddPageOver()
    store.dispatch(CLOSE_MAIN_MENU())
}
const onClickNewPageAfter = () => {
    handleAddPageUnder()
    store.dispatch(CLOSE_MAIN_MENU())
}
const onClickDeletePage = () => {
    handleDeleteCurrentPage()
    store.dispatch(CLOSE_MAIN_MENU())
}
const onClickClearPage = () => {
    handleClearPage()
    store.dispatch(CLOSE_MAIN_MENU())
}
const onClickDeleteAllPages = () => {
    handleDeleteAllPages(true)
}
const onClickPageStyle = () => {
    store.dispatch(SET_MAIN_SUB_MENU(MainSubMenuState.PageStyle))
}
const onClickPageSize = () => {
    store.dispatch(SET_MAIN_SUB_MENU(MainSubMenuState.PageSize))
}

const PageMenu = () => {
    return (
        <SubMenuWrap>
            <MenuItem
                text={<FormattedMessage id="Menu.General.Page.NewBefore" />}
                icon={<PageAboveIcon />}
                onClick={onClickNewPageBefore}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.General.Page.NewAfter" />}
                icon={<PageBelowIcon />}
                onClick={onClickNewPageAfter}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.General.Page.Clear" />}
                icon={<PageClearIcon />}
                onClick={onClickClearPage}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.General.Page.Delete" />}
                icon={<PageDeleteIcon />}
                onClick={onClickDeletePage}
            />
            <Divider />
            <MenuItem
                warning
                text={<FormattedMessage id="Menu.General.Page.DeleteAll" />}
                // icon={<PageDeleteAllIcon />}
                onClick={onClickDeleteAllPages}
            />
            <Divider />
            <MenuItem
                text={<FormattedMessage id="Menu.General.Page.PageStyle" />}
                onClick={onClickPageStyle}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.General.Page.PageSize" />}
                onClick={onClickPageSize}
            />
        </SubMenuWrap>
    )
}
export default PageMenu
