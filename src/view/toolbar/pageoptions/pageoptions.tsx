import { FormattedMessage } from "language"
import React from "react"
import store from "redux/store"
import { OPEN_PAGE_ACTIONS } from "redux/menu/menu"
import { IconButton, Position, ToolTip } from "components"
import { BsFileDiff } from "react-icons/bs"

const PageOptions: React.FC = () => {
    return (
        <ToolTip
            position={Position.BottomLeft}
            text={<FormattedMessage id="ToolBar.PageSettings" />}>
            <IconButton onClick={() => store.dispatch(OPEN_PAGE_ACTIONS())}>
                <BsFileDiff id="transitory-icon" />
            </IconButton>
        </ToolTip>
    )
}

export default PageOptions
