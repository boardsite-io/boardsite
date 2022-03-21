import React, { useCallback } from "react"
import { FormattedMessage } from "language"
import { TickIcon } from "components"
import { PAGE_SIZE } from "consts"
import { drawing } from "state/drawing"
import { PageSize } from "state/board/state/index.types"
import MenuItem from "View/MainMenu/MenuItem"
import { SubMenuWrap } from "View/MainMenu/index.styled"
import { useGState } from "state"

const onClickA4landscape = () => {
    drawing.setPageSize(PAGE_SIZE.A4_LANDSCAPE)
}
const onClickA4portrait = () => {
    drawing.setPageSize(PAGE_SIZE.A4_PORTRAIT)
}

const PageSizeMenu = () => {
    const { width, height } = useGState("PageSizeMenu").drawing.pageMeta.size

    const isMatch = useCallback(
        (size: PageSize) => width === size.width && height === size.height,
        [width, height]
    )

    return (
        <SubMenuWrap>
            <MenuItem
                text={<FormattedMessage id="Menu.Page.Size.A4Portrait" />}
                icon={isMatch(PAGE_SIZE.A4_PORTRAIT) && <TickIcon />}
                onClick={onClickA4portrait}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.Page.Size.A4Landscape" />}
                icon={isMatch(PAGE_SIZE.A4_LANDSCAPE) && <TickIcon />}
                onClick={onClickA4landscape}
            />
        </SubMenuWrap>
    )
}
export default PageSizeMenu
