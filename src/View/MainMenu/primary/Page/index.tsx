import {
    HorizontalRule,
    PageAboveIcon,
    PageBelowIcon,
    // PageClearIcon,
    // PageDeleteIcon,
    // PageDeleteAllIcon,
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
import { CLOSE_MAIN_MENU, MainSubMenuState } from "redux/menu/menu"
import store from "redux/store"
import { MainMenuWrap } from "../../index.styled"
import MenuItem from "../../MenuItem"

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

const PageMenu = () => {
    return (
        <MainMenuWrap>
            <MenuItem
                isMainMenu
                text={<FormattedMessage id="Menu.Page.NewBefore" />}
                icon={<PageAboveIcon />}
                onClick={onClickNewPageBefore}
            />
            <MenuItem
                isMainMenu
                text={<FormattedMessage id="Menu.Page.NewAfter" />}
                icon={<PageBelowIcon />}
                onClick={onClickNewPageAfter}
            />
            <HorizontalRule />
            <MenuItem
                isMainMenu
                text={<FormattedMessage id="Menu.Page.Style" />}
                expandMenu={MainSubMenuState.PageStyle}
            />
            <MenuItem
                isMainMenu
                text={<FormattedMessage id="Menu.Page.Size" />}
                expandMenu={MainSubMenuState.PageSize}
            />
            <HorizontalRule />
            <MenuItem
                isMainMenu
                text={<FormattedMessage id="Menu.Page.Clear" />}
                // icon={<PageClearIcon />}
                onClick={onClickClearPage}
            />
            <MenuItem
                isMainMenu
                text={<FormattedMessage id="Menu.Page.Delete" />}
                // icon={<PageDeleteIcon />}
                onClick={onClickDeletePage}
            />
            <MenuItem
                isMainMenu
                warning
                text={<FormattedMessage id="Menu.Page.DeleteAll" />}
                // icon={<PageDeleteAllIcon />}
                onClick={onClickDeleteAllPages}
            />
        </MainMenuWrap>
    )
}
export default PageMenu
