import React from "react"
import { HorizontalRule, TickIcon } from "components"
import { backgroundStyle } from "consts"
import { FormattedMessage } from "language"
import { drawing, useDrawing } from "state/drawing"
import { handleChangePageBackground } from "drawing/handlers"
import { SubMenuWrap } from "../../index.styled"
import MenuItem from "../../MenuItem"

const onClickBlank = () => {
    drawing.setPageBackground(backgroundStyle.BLANK)
}
const onClickCheckered = () => {
    drawing.setPageBackground(backgroundStyle.CHECKERED)
}
const onClickRuled = () => {
    drawing.setPageBackground(backgroundStyle.RULED)
}
const onClickApply = () => {
    handleChangePageBackground()
}
const PageStyleMenu = () => {
    const { style } = useDrawing("PageStyleMenu").pageMeta.background

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
