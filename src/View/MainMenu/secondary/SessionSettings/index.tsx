import React from "react"
import { SubMenuWrap } from "../../index.styled"
import MenuItem from "../../MenuItem"

const SessionSettingsMenu = () => {
    return (
        <SubMenuWrap level={2}>
            <MenuItem
                text="Read only"
                onClick={() => undefined}
                // icon={<TickIcon />}
            />
        </SubMenuWrap>
    )
}
export default SessionSettingsMenu
