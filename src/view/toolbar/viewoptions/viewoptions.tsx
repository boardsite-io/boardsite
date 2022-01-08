import { FormattedMessage } from "language"
import React from "react"
import store from "redux/store"
import {
    ExpandIcon,
    IconButton,
    Position,
    ShrinkIcon,
    ToolTip,
} from "components"
import { FIT_WIDTH_TO_PAGE, RESET_VIEW } from "redux/board/board"

const ViewOptions: React.FC = () => {
    return (
        <>
            <ToolTip
                position={Position.BottomLeft}
                text={<FormattedMessage id="ToolBar.ResetView" />}>
                <IconButton onClick={() => store.dispatch(RESET_VIEW())}>
                    <ShrinkIcon />
                </IconButton>
            </ToolTip>
            <ToolTip
                position={Position.BottomLeft}
                text={<FormattedMessage id="ToolBar.MaximizeView" />}>
                <IconButton onClick={() => store.dispatch(FIT_WIDTH_TO_PAGE())}>
                    <ExpandIcon />
                </IconButton>
            </ToolTip>
        </>
    )
}

export default ViewOptions
