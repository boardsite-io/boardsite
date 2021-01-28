import React from "react"
import { FastLayer } from "react-konva"
import store from "../../redux/store"
import { StrokeShape } from "./stroke"

export default function LiveLayer(props) {
    // eslint-disable-next-line react/destructuring-assignment
    const pts = props.sel

    return (
        <FastLayer>
            {pts !== undefined ? (
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
