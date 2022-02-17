import React from "react"
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
import { menu } from "state/menu"
import { MainSubMenuState } from "state/menu/state/index.types"
import { MainMenuWrap } from "../../index.styled"
import MenuItem from "../../MenuItem"

const onClickNewPageBefore = () => {
    handleAddPageOver()
    menu.closeMainMenu()
}
const onClickNewPageAfter = () => {
    handleAddPageUnder()
    menu.closeMainMenu()
}
const onClickDeletePage = () => {
    handleDeleteCurrentPage()
    menu.closeMainMenu()
}
const onClickClearPage = () => {
    handleClearPage()
    menu.closeMainMenu()
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
