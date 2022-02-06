import React, { useCallback } from "react"
import { FormattedMessage } from "language"
import { TickIcon } from "components"
import { pageSize } from "consts"
import { useCustomSelector } from "hooks"
import { SET_PAGE_SIZE } from "redux/drawing"
import { PageSize } from "redux/board/index.types"
import store from "redux/store"
import { SubMenuWrap } from "../../index.styled"
import MenuItem from "../../MenuItem"

const onClickA4landscape = () => {
    store.dispatch(SET_PAGE_SIZE(pageSize.a4landscape))
}
const onClickA4portrait = () => {
    store.dispatch(SET_PAGE_SIZE(pageSize.a4portrait))
}

const PageSizeMenu = () => {
    const { width, height } = useCustomSelector(
        (state) => state.drawing.pageMeta.size
    )
    const isMatch = useCallback(
        (size: PageSize) => width === size.width && height === size.height,
        [width, height]
    )

    return (
        <SubMenuWrap level={4}>
            <MenuItem
                text={<FormattedMessage id="Menu.Page.Size.A4Portrait" />}
                icon={isMatch(pageSize.a4portrait) ? <TickIcon /> : undefined}
                onClick={onClickA4portrait}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.Page.Size.A4Landscape" />}
                icon={isMatch(pageSize.a4landscape) ? <TickIcon /> : undefined}
                onClick={onClickA4landscape}
            />
        </SubMenuWrap>
    )
}
export default PageSizeMenu
