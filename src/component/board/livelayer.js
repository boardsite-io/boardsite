import React from "react"
import { FastLayer } from "react-konva"
import { useSelector } from "react-redux"
import store from "../../redux/store"
import { StrokeShape } from "./stroke"

export default function LiveLayer() {
    const pts = useSelector((state) => state.drawControl.liveStroke.points)

    return (
        <FastLayer>
            {pts.length > 0 ? (
                <StrokeShape
                    stroke={{
                        ...store.getState().drawControl.liveStroke,
                        points: pts,
                    }}
                />
            ) : (
                <></>
            )}
        </FastLayer>
    )
}
