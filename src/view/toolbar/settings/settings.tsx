import React from "react"
import { BsGear } from "react-icons/bs"
import store from "redux/store"
import { IconButton, Position, ToolTip } from "components"
import { OPEN_SETTINGS } from "redux/menu/menu"
import { ToolTipText } from "language"

const Settings: React.FC = () => (
    <ToolTip position={Position.BottomRight} text={ToolTipText.Settings}>
        <IconButton onClick={() => store.dispatch(OPEN_SETTINGS())}>
            <BsGear id="icon" />
        </IconButton>
    </ToolTip>
)

export default Settings
