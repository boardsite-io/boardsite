import React from "react"
import { FormattedMessage } from "language"
import { TickIcon } from "components"
import { useGState } from "state"
import { settings } from "state/settings"
import { ThemeOption } from "theme/themes"
import { online } from "state/online"
import { SubMenuWrap } from "View/MainMenu/index.styled"
import MenuItem from "View/MainMenu/MenuItem"

const ThemeMenu = () => {
    const { theme: activeTheme } = useGState("Theme").settings
    useGState("Session")

    return (
        <SubMenuWrap>
            <MenuItem
                text={<FormattedMessage id="Menu.General.Theme.Light" />}
                onClick={() => settings.setTheme(ThemeOption.Light)}
                icon={activeTheme === ThemeOption.Light && <TickIcon />}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.General.Theme.Dark" />}
                onClick={() => settings.setTheme(ThemeOption.Dark)}
                icon={activeTheme === ThemeOption.Dark && <TickIcon />}
            />
            <MenuItem
                disabled={!online.isAuthorized()}
                text={<FormattedMessage id="Menu.General.Theme.Apple" />}
                onClick={() => settings.setTheme(ThemeOption.Apple)}
                icon={activeTheme === ThemeOption.Apple && <TickIcon />}
            />
            <MenuItem
                disabled={!online.isAuthorized()}
                text={<FormattedMessage id="Menu.General.Theme.Candy" />}
                onClick={() => settings.setTheme(ThemeOption.Candy)}
                icon={activeTheme === ThemeOption.Candy && <TickIcon />}
            />
            <MenuItem
                disabled={!online.isAuthorized()}
                text={<FormattedMessage id="Menu.General.Theme.Ocean" />}
                onClick={() => settings.setTheme(ThemeOption.Ocean)}
                icon={activeTheme === ThemeOption.Ocean && <TickIcon />}
            />
            <MenuItem
                disabled={!online.isAuthorized()}
                text={<FormattedMessage id="Menu.General.Theme.Orange" />}
                onClick={() => settings.setTheme(ThemeOption.Orange)}
                icon={activeTheme === ThemeOption.Orange && <TickIcon />}
            />
            <MenuItem
                disabled={!online.isAuthorized()}
                text={<FormattedMessage id="Menu.General.Theme.Purple" />}
                onClick={() => settings.setTheme(ThemeOption.Purple)}
                icon={activeTheme === ThemeOption.Purple && <TickIcon />}
            />
            <MenuItem
                disabled={!online.isAuthorized()}
                text={<FormattedMessage id="Menu.General.Theme.Soil" />}
                onClick={() => settings.setTheme(ThemeOption.Soil)}
                icon={activeTheme === ThemeOption.Soil && <TickIcon />}
            />
            <MenuItem
                disabled={!online.isAuthorized()}
                text={<FormattedMessage id="Menu.General.Theme.Sun" />}
                onClick={() => settings.setTheme(ThemeOption.Sun)}
                icon={activeTheme === ThemeOption.Sun && <TickIcon />}
            />
            <MenuItem
                disabled={!online.isAuthorized()}
                text={<FormattedMessage id="Menu.General.Theme.Teal" />}
                onClick={() => settings.setTheme(ThemeOption.Teal)}
                icon={activeTheme === ThemeOption.Teal && <TickIcon />}
            />
        </SubMenuWrap>
    )
}
export default ThemeMenu
