import React, { useState } from "react"
import {
    ExpandableIcon,
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
import { CSSTransition } from "react-transition-group"
import { cssTransition } from "View/MainMenu/cssTransition"
import { MainMenuWrap } from "../../index.styled"
import MenuItem from "../../MenuItem"
import PageSizeMenu from "./PageSize"
import PageStyle from "./PageStyle"

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

enum SubMenu {
    Closed,
    PageStyle,
    PageSize,
}

const PageMenu = () => {
    const [subMenu, setSubMenu] = useState<SubMenu>(SubMenu.Closed)

    return (
        <MainMenuWrap>
            <MenuItem
                text={<FormattedMessage id="Menu.Page.NewBefore" />}
                icon={<PageAboveIcon />}
                onClick={onClickNewPageBefore}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.Page.NewAfter" />}
                icon={<PageBelowIcon />}
                onClick={onClickNewPageAfter}
            />
            <HorizontalRule />
            <MenuItem
                text={<FormattedMessage id="Menu.Page.Style" />}
                expandMenu={() => setSubMenu(SubMenu.PageSize)}
                icon={<ExpandableIcon />}
            >
                <CSSTransition
                    in={subMenu === SubMenu.PageSize}
                    {...cssTransition}
                >
                    <PageSizeMenu />
                </CSSTransition>
            </MenuItem>
            <MenuItem
                text={<FormattedMessage id="Menu.Page.Size" />}
                expandMenu={() => setSubMenu(SubMenu.PageStyle)}
                icon={<ExpandableIcon />}
            >
                <CSSTransition
                    in={subMenu === SubMenu.PageStyle}
                    {...cssTransition}
                >
                    <PageStyle />
                </CSSTransition>
            </MenuItem>
            <HorizontalRule />
            <MenuItem
                text={<FormattedMessage id="Menu.Page.Clear" />}
                // icon={<PageClearIcon />}
                onClick={onClickClearPage}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.Page.Delete" />}
                // icon={<PageDeleteIcon />}
                onClick={onClickDeletePage}
            />
            <MenuItem
                warning
                text={<FormattedMessage id="Menu.Page.DeleteAll" />}
                // icon={<PageDeleteAllIcon />}
                onClick={onClickDeleteAllPages}
            />
        </MainMenuWrap>
    )
}
export default PageMenu
