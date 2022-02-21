import { TickIcon } from "components"
import { FormattedMessage } from "language"
import React from "react"
import { board, useBoard } from "state/board"
import { drawing, useDrawing } from "state/drawing"
import { SubMenuWrap } from "../../index.styled"
import MenuItem from "../../MenuItem"

const SettingsMenu = () => {
    const { keepCentered } = useBoard("SettingsMenu").view
    const { directDraw } = useDrawing("SettingsMenu")

    return (
        <SubMenuWrap level={4}>
            <MenuItem
                text={<FormattedMessage id="Menu.General.Settings.Center" />}
                onClick={() => board.toggleShouldCenter()}
                icon={keepCentered ? <TickIcon /> : undefined}
            />
            <MenuItem
                text={
                    <FormattedMessage id="Menu.General.Settings.DirectDraw" />
                }
                onClick={() => drawing.toggleDirectDraw()}
                icon={directDraw ? <TickIcon /> : undefined}
            />
        </SubMenuWrap>
    )
}
export default SettingsMenu
