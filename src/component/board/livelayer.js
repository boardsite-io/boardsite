import React from "react"
import { Layer } from "react-konva"
import store from "../../redux/store"
import { StrokeShape } from "./stroke"

export default function LiveLayer(props) {
    // eslint-disable-next-line react/destructuring-assignment
    const pts = props.sel

    return (
        <Layer>
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
        </Layer>
    )
}
