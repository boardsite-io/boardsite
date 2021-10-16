import { IconButton, ZoomInIcon, ZoomOutIcon } from "components"
import React from "react"
import store from "redux/store"

const ViewZoom: React.FC = () => (
    <>
        <IconButton
            onClick={() =>
                store.dispatch({
                    type: "ZOOM_IN_CENTER",
                    payload: undefined,
                })
            }>
            <ZoomInIcon />
        </IconButton>
        <IconButton
            onClick={() =>
                store.dispatch({
                    type: "ZOOM_OUT_CENTER",
                    payload: undefined,
                })
            }>
            <ZoomOutIcon />
        </IconButton>
    </>
)

export default ViewZoom
