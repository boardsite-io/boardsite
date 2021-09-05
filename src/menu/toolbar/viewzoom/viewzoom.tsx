import { IconButton } from "components"
import React from "react"
import { MdZoomIn, MdZoomOut } from "react-icons/md"
import { ZOOM_IN_CENTER, ZOOM_OUT_CENTER } from "redux/slice/viewcontrol"
import store from "redux/store"

const ViewZoom: React.FC = () => (
    <>
        <IconButton onClick={() => store.dispatch(ZOOM_IN_CENTER())}>
            <MdZoomIn id="icon" />
        </IconButton>
        <IconButton onClick={() => store.dispatch(ZOOM_OUT_CENTER())}>
            <MdZoomOut id="icon" />
        </IconButton>
    </>
)

export default ViewZoom
