import React from "react"
import { FormattedMessage } from "language"
import { TickIcon } from "components"
import { theme, useTheme } from "state/theme"
import { useOnline } from "state/online"
import { Theme } from "theme"
import { SubMenuWrap } from "../../../index.styled"
import MenuItem from "../../../MenuItem"

const ThemeMenu = () => {
    const { theme: activeTheme } = useTheme("theme")
    const isAuthorized = useOnline("session").isAuthorized()

    return (
        <SubMenuWrap>
            <MenuItem
                text={<FormattedMessage id="Menu.General.Theme.Light" />}
                onClick={() => theme.setTheme(Theme.Light)}
                icon={activeTheme === Theme.Light && <TickIcon />}
            />
            <MenuItem
                text={<FormattedMessage id="Menu.General.Theme.Dark" />}
                onClick={() => theme.setTheme(Theme.Dark)}
                icon={activeTheme === Theme.Dark && <TickIcon />}
            />
            <MenuItem
                disabled={!isAuthorized}
                text={<FormattedMessage id="Menu.General.Theme.Apple" />}
                onClick={() => theme.setTheme(Theme.Apple)}
                icon={activeTheme === Theme.Apple && <TickIcon />}
            />
            <MenuItem
                disabled={!isAuthorized}
                text={<FormattedMessage id="Menu.General.Theme.Candy" />}
                onClick={() => theme.setTheme(Theme.Candy)}
                icon={activeTheme === Theme.Candy && <TickIcon />}
            />
            <MenuItem
                disabled={!isAuthorized}
                text={<FormattedMessage id="Menu.General.Theme.Ocean" />}
                onClick={() => theme.setTheme(Theme.Ocean)}
                icon={activeTheme === Theme.Ocean && <TickIcon />}
            />
            <MenuItem
                disabled={!isAuthorized}
                text={<FormattedMessage id="Menu.General.Theme.Orange" />}
                onClick={() => theme.setTheme(Theme.Orange)}
                icon={activeTheme === Theme.Orange && <TickIcon />}
            />
            <MenuItem
                disabled={!isAuthorized}
                text={<FormattedMessage id="Menu.General.Theme.Purple" />}
                onClick={() => theme.setTheme(Theme.Purple)}
                icon={activeTheme === Theme.Purple && <TickIcon />}
            />
            <MenuItem
                disabled={!isAuthorized}
                text={<FormattedMessage id="Menu.General.Theme.Soil" />}
                onClick={() => theme.setTheme(Theme.Soil)}
                icon={activeTheme === Theme.Soil && <TickIcon />}
            />
            <MenuItem
                disabled={!isAuthorized}
                text={<FormattedMessage id="Menu.General.Theme.Sun" />}
                onClick={() => theme.setTheme(Theme.Sun)}
                icon={activeTheme === Theme.Sun && <TickIcon />}
            />
            <MenuItem
                disabled={!isAuthorized}
                text={<FormattedMessage id="Menu.General.Theme.Teal" />}
                onClick={() => theme.setTheme(Theme.Teal)}
                icon={activeTheme === Theme.Teal && <TickIcon />}
            />
        </SubMenuWrap>
    )
}
export default ThemeMenu
