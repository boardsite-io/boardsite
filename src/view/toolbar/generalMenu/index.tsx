import { FormattedMessage } from "language"
import React, { memo } from "react"
import store from "redux/store"
import { OPEN_GENERAL_MENU } from "redux/menu/menu"
import { IconButton, MenuIcon, Position, ToolTip } from "components"

const GeneralMenu: React.FC = memo(() => {
    return (
        <ToolTip
            position={Position.BottomRight}
            text={<FormattedMessage id="ToolBar.GeneralMenu" />}
        >
            <IconButton onClick={() => store.dispatch(OPEN_GENERAL_MENU())}>
                <MenuIcon />
            </IconButton>
        </ToolTip>
    )
})

export default GeneralMenu
