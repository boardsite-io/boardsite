import React, { useCallback } from "react"
import { FormattedMessage } from "language"
import { TickIcon } from "components"
import { pageSize } from "consts"
import { useCustomSelector } from "hooks"
import { SET_PAGE_SIZE } from "redux/board/board"
import { PageSize } from "redux/board/board.types"
import { GeneralMenuState, SET_GENERAL_MENU } from "redux/menu/menu"
import store from "redux/store"
import { SubMenu } from "../index.styled"
import MenuItem from "../menuItem"

const onClickA4landscape = () => {
    store.dispatch(SET_PAGE_SIZE(pageSize.a4landscape))
    store.dispatch(SET_GENERAL_MENU(GeneralMenuState.Page))
}
const onClickA4portrait = () => {
    store.dispatch(SET_PAGE_SIZE(pageSize.a4portrait))
    store.dispatch(SET_GENERAL_MENU(GeneralMenuState.Page))
}
const onClickSquare = () => {
    store.dispatch(SET_PAGE_SIZE(pageSize.square))
    store.dispatch(SET_GENERAL_MENU(GeneralMenuState.Page))
}

const PageSizeMenu = () => {
    const { width, height } = useCustomSelector(
        (state) => state.board.pageMeta.size
    )
    const isMatch = useCallback(
        (size: PageSize) => width === size.width && height === size.height,
        [width, height]
    )

    return (
        <SubMenu>
            <MenuItem
                text={
                    <FormattedMessage id="GeneralMenu.PageSize.A4Landscape" />
                }
                icon={isMatch(pageSize.a4landscape) ? <TickIcon /> : undefined}
                onClick={onClickA4landscape}
            />
            <MenuItem
                text={<FormattedMessage id="GeneralMenu.PageSize.A4Portrait" />}
                icon={isMatch(pageSize.a4portrait) ? <TickIcon /> : undefined}
                onClick={onClickA4portrait}
            />
            <MenuItem
                text={<FormattedMessage id="GeneralMenu.PageSize.Square" />}
                icon={isMatch(pageSize.square) ? <TickIcon /> : undefined}
                onClick={onClickSquare}
            />
        </SubMenu>
    )
}
export default PageSizeMenu
