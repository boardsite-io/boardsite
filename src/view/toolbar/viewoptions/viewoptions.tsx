import React from "react"
import {
    ExpandIcon,
    IconButton,
    Position,
    ShrinkIcon,
    ToolTip,
} from "components"
import { FIT_WIDTH_TO_PAGE, RESET_VIEW } from "redux/board/board"
import store from "redux/store"
import { ToolTipText } from "language"

const ViewOptions: React.FC = () => (
    <>
        <ToolTip position={Position.BottomLeft} text={ToolTipText.ResetView}>
            <IconButton onClick={() => store.dispatch(RESET_VIEW())}>
                <ShrinkIcon />
            </IconButton>
        </ToolTip>
        <ToolTip position={Position.BottomLeft} text={ToolTipText.MaximizeView}>
            <IconButton onClick={() => store.dispatch(FIT_WIDTH_TO_PAGE())}>
                <ExpandIcon />
            </IconButton>
        </ToolTip>
    </>
)

export default ViewOptions
