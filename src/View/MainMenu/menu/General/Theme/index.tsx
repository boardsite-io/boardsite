import React from "react"
import { FormattedMessage } from "language"
import { TickIcon } from "components"
import { theme, useTheme } from "state/theme"
import { Theme } from "theme"
import { SubMenuWrap } from "../../../index.styled"
import MenuItem from "../../../MenuItem"

const ThemeMenu = () => {
    const { theme: activeTheme } = useTheme("theme")

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
        </SubMenuWrap>
    )
}
export default ThemeMenu
