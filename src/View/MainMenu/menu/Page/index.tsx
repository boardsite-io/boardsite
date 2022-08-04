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
import { FormattedMessage } from "language"
import { action } from "state/action"
import { menu } from "state/menu"
import { CSSTransition } from "react-transition-group"
import { cssTransition } from "View/MainMenu/cssTransition"
import { MainMenuWrap } from "View/MainMenu/index.styled"
import MenuItem from "View/MainMenu/MenuItem"
import PageSizeMenu from "./PageSize"
import PageStyle from "./PageStyle"

const onClickNewPageBefore = () => {
    action.addPageOver()
    menu.closeMainMenu()
}
const onClickNewPageAfter = () => {
    action.addPageUnder()
    menu.closeMainMenu()
}
const onClickDeletePage = () => {
    action.deleteCurrentPage()
    menu.closeMainMenu()
}
const onClickClearPage = () => {
    action.clearPage()
    menu.closeMainMenu()
}
const onClickDeleteAllPages = () => {
    action.deleteAllPages()
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
            <MenuItem
                text={<FormattedMessage id="Menu.Page.Size" />}
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
