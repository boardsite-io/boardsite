import React from "react"
import { HorizontalRule, TickIcon } from "components"
import { FormattedMessage } from "language"
import { drawing } from "state/drawing"
import { SubMenuWrap } from "View/MainMenu/index.styled"
import MenuItem from "View/MainMenu/MenuItem"
import { useGState } from "state"
import { Paper } from "state/board/state/index.types"
import { action } from "state/action"

const onClickBlank = () => {
    drawing.setPageBackground(Paper.Blank)
}
const onClickCheckered = () => {
    drawing.setPageBackground(Paper.Checkered)
}
const onClickRuled = () => {
    drawing.setPageBackground(Paper.Ruled)
}
const onClickApply = () => {
    action.applyPageBackground()
}
const PageStyle = () => {
    const { paper } = useGState("PageStyleMenu").drawing.pageMeta.background

    return (
        <SubMenuWrap>
            <MenuItem
                text={<FormattedMessage id="Menu.Page.Style.Blank" />}
                icon={paper === Paper.Blank && <TickIcon />}
                onClick={onClickBlank}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.Page.Style.Checkered" />}
                icon={paper === Paper.Checkered && <TickIcon />}
                onClick={onClickCheckered}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.Page.Style.Ruled" />}
                icon={paper === Paper.Ruled && <TickIcon />}
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
export default PageStyle
