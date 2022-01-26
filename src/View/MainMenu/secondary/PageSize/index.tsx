import React, { useCallback } from "react"
import { FormattedMessage } from "language"
import { TickIcon } from "components"
import { pageSize } from "consts"
import { useCustomSelector } from "hooks"
import { SET_PAGE_SIZE } from "redux/board/board"
import { PageSize } from "redux/board/board.types"
import store from "redux/store"
import { SubMenuWrap } from "../../index.styled"
import MenuItem from "../../MenuItem"

const onClickA4landscape = () => {
    store.dispatch(SET_PAGE_SIZE(pageSize.a4landscape))
}
const onClickA4portrait = () => {
    store.dispatch(SET_PAGE_SIZE(pageSize.a4portrait))
}
const onClickSquare = () => {
    store.dispatch(SET_PAGE_SIZE(pageSize.square))
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
        <SubMenuWrap>
            <MenuItem
                text={<FormattedMessage id="Menu.Page.Size.A4Landscape" />}
                icon={isMatch(pageSize.a4landscape) ? <TickIcon /> : undefined}
                onClick={onClickA4landscape}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.Page.Size.A4Portrait" />}
                icon={isMatch(pageSize.a4portrait) ? <TickIcon /> : undefined}
                onClick={onClickA4portrait}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.Page.Size.Square" />}
                icon={isMatch(pageSize.square) ? <TickIcon /> : undefined}
                onClick={onClickSquare}
            />
        </SubMenuWrap>
    )
}
export default PageSizeMenu
