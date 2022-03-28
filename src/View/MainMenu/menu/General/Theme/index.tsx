import React from "react"
import { FormattedMessage } from "language"
import { TickIcon } from "components"
import { useGState } from "state"
import { settings } from "state/settings"
import { Theme } from "theme"
import { SubMenuWrap } from "../../../index.styled"
import MenuItem from "../../../MenuItem"

const ThemeMenu = () => {
    const { theme: activeTheme } = useGState("Theme").settings
    const { isAuthorized } = useGState("Session").online

    return (
        <SubMenuWrap>
            <MenuItem
                text={<FormattedMessage id="Menu.General.Theme.Light" />}
                onClick={() => settings.setTheme(Theme.Light)}
                icon={activeTheme === Theme.Light && <TickIcon />}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.General.Theme.Dark" />}
                onClick={() => settings.setTheme(Theme.Dark)}
                icon={activeTheme === Theme.Dark && <TickIcon />}
            />
            <MenuItem
                disabled={!isAuthorized}
                text={<FormattedMessage id="Menu.General.Theme.Apple" />}
                onClick={() => settings.setTheme(Theme.Apple)}
                icon={activeTheme === Theme.Apple && <TickIcon />}
            />
            <MenuItem
                disabled={!isAuthorized}
                text={<FormattedMessage id="Menu.General.Theme.Candy" />}
                onClick={() => settings.setTheme(Theme.Candy)}
                icon={activeTheme === Theme.Candy && <TickIcon />}
            />
            <MenuItem
                disabled={!isAuthorized}
                text={<FormattedMessage id="Menu.General.Theme.Ocean" />}
                onClick={() => settings.setTheme(Theme.Ocean)}
                icon={activeTheme === Theme.Ocean && <TickIcon />}
            />
            <MenuItem
                disabled={!isAuthorized}
                text={<FormattedMessage id="Menu.General.Theme.Orange" />}
                onClick={() => settings.setTheme(Theme.Orange)}
                icon={activeTheme === Theme.Orange && <TickIcon />}
            />
            <MenuItem
                disabled={!isAuthorized}
                text={<FormattedMessage id="Menu.General.Theme.Purple" />}
                onClick={() => settings.setTheme(Theme.Purple)}
                icon={activeTheme === Theme.Purple && <TickIcon />}
            />
            <MenuItem
                disabled={!isAuthorized}
                text={<FormattedMessage id="Menu.General.Theme.Soil" />}
                onClick={() => settings.setTheme(Theme.Soil)}
                icon={activeTheme === Theme.Soil && <TickIcon />}
            />
            <MenuItem
                disabled={!isAuthorized}
                text={<FormattedMessage id="Menu.General.Theme.Sun" />}
                onClick={() => settings.setTheme(Theme.Sun)}
                icon={activeTheme === Theme.Sun && <TickIcon />}
            />
            <MenuItem
                disabled={!isAuthorized}
                text={<FormattedMessage id="Menu.General.Theme.Teal" />}
                onClick={() => settings.setTheme(Theme.Teal)}
                icon={activeTheme === Theme.Teal && <TickIcon />}
            />
        </SubMenuWrap>
    )
}
export default ThemeMenu
