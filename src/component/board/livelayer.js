import React, { memo } from "react"
import { Layer } from "react-konva"
import { useSelector } from "react-redux"
import store from "../../redux/store"
import { StrokeShape } from "./stroke"

export default memo(() => {
    const pts = useSelector((state) => state.drawControl.liveStroke.points)

    return (
        <Layer listening={false}>
            {pts.length > 0 ? (
                <StrokeShape stroke={store.getState().drawControl.liveStroke} />
            ) : (
                <></>
            )}
        </Layer>
    )
})
