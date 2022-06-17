import React from "react"
import { TickIcon } from "components"
import { FormattedMessage } from "language"
import { settings } from "state/settings"
import { useGState } from "state"
import { SubMenuWrap } from "View/MainMenu/index.styled"
import MenuItem from "View/MainMenu/MenuItem"

const SettingsMenu = () => {
    const { keepCentered, directDraw } = useGState("Settings").settings

    return (
        <SubMenuWrap>
            <MenuItem
                text={<FormattedMessage id="Menu.General.Settings.Center" />}
                onClick={() => settings.toggleShouldCenter()}
                icon={keepCentered && <TickIcon />}
            />
            <MenuItem
                text={
                    <FormattedMessage id="Menu.General.Settings.DirectDraw" />
                }
                onClick={() => settings.toggleDirectDraw()}
                icon={directDraw && <TickIcon />}
            />
        </SubMenuWrap>
    )
}
export default SettingsMenu
