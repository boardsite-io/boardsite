import React from "react"
import Tooltip from "@material-ui/core/Tooltip"
import { MdZoomIn, MdZoomOut } from "react-icons/md"
import {
    ZOOM_IN_CENTER,
    ZOOM_OUT_CENTER,
} from "../../../redux/slice/viewcontrol"
import store from "../../../redux/store"
import "../../../css/viewzoom.css"

export default function ViewZoom() {
    return (
        <div className="viewzoom-wrap">
            <Tooltip
                id="tooltip"
                title="Zoom In"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <button
                    type="button"
                    id="icon-button"
                    onClick={() => store.dispatch(ZOOM_IN_CENTER())}>
                    <MdZoomIn id="icon" />
                </button>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="Zoom Out"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <button
                    type="button"
                    id="icon-button"
                    onClick={() => store.dispatch(ZOOM_OUT_CENTER())}>
                    <MdZoomOut id="icon" />
                </button>
            </Tooltip>
        </div>
    )
}
