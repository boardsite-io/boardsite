import {
    IconButton,
    Position,
    ToolTip,
    ZoomInIcon,
    ZoomOutIcon,
} from "components"
import { ToolTipText } from "language"
import React from "react"
import { ZOOM_IN_CENTER, ZOOM_OUT_CENTER } from "redux/board/board"
import store from "redux/store"

const ViewZoom: React.FC = () => (
    <>
        <ToolTip position={Position.Bottom} text={ToolTipText.ZoomIn}>
            <IconButton onClick={() => store.dispatch(ZOOM_IN_CENTER())}>
                <ZoomInIcon />
            </IconButton>
        </ToolTip>
        <ToolTip position={Position.Bottom} text={ToolTipText.ZoomOut}>
            <IconButton onClick={() => store.dispatch(ZOOM_OUT_CENTER())}>
                <ZoomOutIcon />
            </IconButton>
        </ToolTip>
    </>
)

export default ViewZoom
