import { TickIcon } from "components"
import { useCustomSelector } from "hooks"
import { FormattedMessage } from "language"
import React from "react"
import { TOGGLE_SHOULD_CENTER } from "redux/board/board"
import { TOGGLE_DIRECTDRAW } from "redux/drawing/drawing"
import store from "redux/store"
import { SubMenuWrap } from "../../index.styled"
import MenuItem from "../../menuItem"

const SettingsMenu = () => {
    const keepCentered = useCustomSelector(
        (state) => state.board.stage.keepCentered
    )
    const directDraw = useCustomSelector((state) => state.drawing.directDraw)

    return (
        <SubMenuWrap level={4}>
            <MenuItem
                text={<FormattedMessage id="Menu.General.Settings.Center" />}
                onClick={() => store.dispatch(TOGGLE_SHOULD_CENTER())}
                icon={keepCentered ? <TickIcon /> : undefined}
            />
            <MenuItem
                text={
                    <FormattedMessage id="Menu.General.Settings.DirectDraw" />
                }
                onClick={() => store.dispatch(TOGGLE_DIRECTDRAW())}
                icon={directDraw ? <TickIcon /> : undefined}
            />
        </SubMenuWrap>
    )
}
export default SettingsMenu
