import React, { useCallback } from "react"
import { FormattedMessage } from "language"
import { TickIcon } from "components"
import { pageSize } from "consts"
import { drawing, useDrawing } from "state/drawing"
import { PageSize } from "state/board/state/index.types"
import MenuItem from "View/MainMenu/MenuItem"
import { SubMenuWrap } from "View/MainMenu/index.styled"

const onClickA4landscape = () => {
    drawing.setPageSize(pageSize.a4landscape)
}
const onClickA4portrait = () => {
    drawing.setPageSize(pageSize.a4portrait)
}

const PageSizeMenu = () => {
    const { width, height } = useDrawing("PageSizeMenu").pageMeta.size

    const isMatch = useCallback(
        (size: PageSize) => width === size.width && height === size.height,
        [width, height]
    )

    return (
        <SubMenuWrap>
            <MenuItem
                text={<FormattedMessage id="Menu.Page.Size.A4Portrait" />}
                icon={isMatch(pageSize.a4portrait) && <TickIcon />}
                onClick={onClickA4portrait}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.Page.Size.A4Landscape" />}
                icon={isMatch(pageSize.a4landscape) && <TickIcon />}
                onClick={onClickA4landscape}
            />
        </SubMenuWrap>
    )
}
export default PageSizeMenu
