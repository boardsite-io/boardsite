import React from "react"
import { TickIcon } from "components"
import { FormattedMessage } from "language"
import { settings, useSettings } from "state/settings"
import { SubMenuWrap } from "../../../index.styled"
import MenuItem from "../../../MenuItem"

const SettingsMenu = () => {
    const { keepCentered, directDraw } = useSettings("settings")

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
