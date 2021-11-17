import { IconButton, ZoomInIcon, ZoomOutIcon } from "components"
import React from "react"
import { ZOOM_IN_CENTER, ZOOM_OUT_CENTER } from "redux/board/board"
import store from "redux/store"

const ViewZoom: React.FC = () => (
    <>
        <IconButton onClick={() => store.dispatch(ZOOM_IN_CENTER())}>
            <ZoomInIcon />
        </IconButton>
        <IconButton onClick={() => store.dispatch(ZOOM_OUT_CENTER())}>
            <ZoomOutIcon />
        </IconButton>
    </>
)

export default ViewZoom
