import React from "react"
import store from "redux/store"
import { OPEN_PAGE_ACTIONS } from "redux/menu/menu"
import { IconButton, Position, ToolTip } from "components"
import { BsFileDiff } from "react-icons/bs"
import { ToolTipText } from "language"

const PageOptions: React.FC = () => (
    <ToolTip position={Position.BottomLeft} text={ToolTipText.PageSettings}>
        <IconButton onClick={() => store.dispatch(OPEN_PAGE_ACTIONS())}>
            <BsFileDiff />
        </IconButton>
    </ToolTip>
)

export default PageOptions
