import { FormattedMessage } from "language"
import React, { memo } from "react"
import { BsGear } from "react-icons/bs"
import store from "redux/store"
import { IconButton, Position, ToolTip } from "components"
import { OPEN_SETTINGS } from "redux/menu/menu"

const Settings: React.FC = memo(() => {
    return (
        <ToolTip
            position={Position.BottomRight}
            text={<FormattedMessage id="ToolBar.Settings" />}
        >
            <IconButton onClick={() => store.dispatch(OPEN_SETTINGS())}>
                <BsGear id="transitory-icon" />
            </IconButton>
        </ToolTip>
    )
})

export default Settings
