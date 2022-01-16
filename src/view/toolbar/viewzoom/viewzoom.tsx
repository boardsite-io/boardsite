import { FormattedMessage } from "language"
import React, { memo } from "react"
import store from "redux/store"
import {
    IconButton,
    Position,
    ToolTip,
    ZoomInIcon,
    ZoomOutIcon,
} from "components"
import { ZOOM_IN_CENTER, ZOOM_OUT_CENTER } from "redux/board/board"

const ViewZoom: React.FC = memo(() => {
    return (
        <>
            <ToolTip
                position={Position.Bottom}
                text={<FormattedMessage id="ToolBar.ZoomIn" />}
            >
                <IconButton onClick={() => store.dispatch(ZOOM_IN_CENTER())}>
                    <ZoomInIcon />
                </IconButton>
            </ToolTip>
            <ToolTip
                position={Position.Bottom}
                text={<FormattedMessage id="ToolBar.ZoomOut" />}
            >
                <IconButton onClick={() => store.dispatch(ZOOM_OUT_CENTER())}>
                    <ZoomOutIcon />
                </IconButton>
            </ToolTip>
        </>
    )
})

export default ViewZoom
