import React from "react"
import { Divider, TickIcon } from "components"
import { backgroundStyle } from "consts"
import { useCustomSelector } from "hooks"
import { FormattedMessage } from "language"
import { SET_PAGE_BACKGROUND } from "redux/board/board"
import store from "redux/store"
import { MainSubMenuState, SET_MAIN_SUB_MENU } from "redux/menu/menu"
import { handleChangePageBackground } from "drawing/handlers"
import { SubMenuWrap } from "../index.styled"
import MenuItem from "../menuItem"

const onClickBlank = () => {
    store.dispatch(SET_PAGE_BACKGROUND(backgroundStyle.BLANK))
}
const onClickCheckered = () => {
    store.dispatch(SET_PAGE_BACKGROUND(backgroundStyle.CHECKERED))
}
const onClickRuled = () => {
    store.dispatch(SET_PAGE_BACKGROUND(backgroundStyle.RULED))
}
const onClickApply = () => {
    handleChangePageBackground()
}
const onClickPrevious = () => {
    store.dispatch(SET_MAIN_SUB_MENU(MainSubMenuState.Page))
}

const PageStyleMenu = () => {
    const style = useCustomSelector(
        (state) => state.board.pageMeta.background.style
    )

    return (
        <SubMenuWrap>
            <MenuItem
                text={<FormattedMessage id="Menu.General.PageStyle.Blank" />}
                icon={
                    style === backgroundStyle.BLANK ? <TickIcon /> : undefined
                }
                onClick={onClickBlank}
            />
            <MenuItem
                text={
                    <FormattedMessage id="Menu.General.PageStyle.Checkered" />
                }
                icon={
                    style === backgroundStyle.CHECKERED ? (
                        <TickIcon />
                    ) : undefined
                }
                onClick={onClickCheckered}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.General.PageStyle.Ruled" />}
                icon={
                    style === backgroundStyle.RULED ? <TickIcon /> : undefined
                }
                onClick={onClickRuled}
            />
            <Divider />
            <MenuItem
                text={<FormattedMessage id="Menu.General.PageStyle.Apply" />}
                onClick={onClickApply}
            />
            <Divider />
            <MenuItem
                text={<FormattedMessage id="Menu.General.PageStyle.Previous" />}
                onClick={onClickPrevious}
            />
        </SubMenuWrap>
    )
}
export default PageStyleMenu
