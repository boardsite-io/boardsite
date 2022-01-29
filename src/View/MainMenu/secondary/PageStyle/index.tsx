import React from "react"
import { HorizontalRule, TickIcon } from "components"
import { backgroundStyle } from "consts"
import { useCustomSelector } from "hooks"
import { FormattedMessage } from "language"
import { SET_PAGE_BACKGROUND } from "redux/board"
import store from "redux/store"
import { handleChangePageBackground } from "drawing/handlers"
import { SubMenuWrap } from "../../index.styled"
import MenuItem from "../../MenuItem"

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
const PageStyleMenu = () => {
    const style = useCustomSelector(
        (state) => state.board.pageMeta.background.style
    )

    return (
        <SubMenuWrap level={3}>
            <MenuItem
                text={<FormattedMessage id="Menu.Page.Style.Blank" />}
                icon={
                    style === backgroundStyle.BLANK ? <TickIcon /> : undefined
                }
                onClick={onClickBlank}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.Page.Style.Checkered" />}
                icon={
                    style === backgroundStyle.CHECKERED ? (
                        <TickIcon />
                    ) : undefined
                }
                onClick={onClickCheckered}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.Page.Style.Ruled" />}
                icon={
                    style === backgroundStyle.RULED ? <TickIcon /> : undefined
                }
                onClick={onClickRuled}
            />
            <HorizontalRule />
            <MenuItem
                text={<FormattedMessage id="Menu.Page.Style.Apply" />}
                onClick={onClickApply}
            />
        </SubMenuWrap>
    )
}
export default PageStyleMenu
