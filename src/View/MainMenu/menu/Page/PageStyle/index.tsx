import React from "react"
import { HorizontalRule, TickIcon } from "components"
import { PAPER } from "consts"
import { FormattedMessage } from "language"
import { drawing } from "state/drawing"
import { handleChangePageBackground } from "drawing/handlers"
import { SubMenuWrap } from "View/MainMenu/index.styled"
import MenuItem from "View/MainMenu/MenuItem"
import { useGState } from "state"

const onClickBlank = () => {
    drawing.setPageBackground(PAPER.BLANK)
}
const onClickCheckered = () => {
    drawing.setPageBackground(PAPER.CHECKERED)
}
const onClickRuled = () => {
    drawing.setPageBackground(PAPER.RULED)
}
const onClickApply = () => {
    handleChangePageBackground()
}
const PageStyle = () => {
    const { paper } = useGState("PageStyleMenu").drawing.pageMeta.background

    return (
        <SubMenuWrap>
            <MenuItem
                text={<FormattedMessage id="Menu.Page.Style.Blank" />}
                icon={paper === PAPER.BLANK && <TickIcon />}
                onClick={onClickBlank}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.Page.Style.Checkered" />}
                icon={paper === PAPER.CHECKERED && <TickIcon />}
                onClick={onClickCheckered}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.Page.Style.Ruled" />}
                icon={paper === PAPER.RULED && <TickIcon />}
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
