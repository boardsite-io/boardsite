import React from "react"
import { MdZoomIn, MdZoomOut } from "react-icons/md"
import {
    ZOOM_IN_CENTER,
    ZOOM_OUT_CENTER,
} from "../../../redux/slice/viewcontrol"
import store from "../../../redux/store"

const ViewZoom: React.FC = () => (
    <>
        <button
            type="button"
            id="icon-button"
            onClick={() => store.dispatch(ZOOM_IN_CENTER())}>
            <MdZoomIn id="icon" />
        </button>
        <button
            type="button"
            id="icon-button"
            onClick={() => store.dispatch(ZOOM_OUT_CENTER())}>
            <MdZoomOut id="icon" />
        </button>
    </>
)

export default ViewZoom
