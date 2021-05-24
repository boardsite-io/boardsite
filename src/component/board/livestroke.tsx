import React, { memo } from "react"
import { toolType } from "../../constants"
import { useCustomSelector } from "../../redux/hooks"
import store from "../../redux/store"
import StrokeShape from "./strokeshapes"

export default memo(() => {
    // console.log("LiveLayer Memo Redraw")
    const pts = useCustomSelector(
        (state) => state.drawControl.liveStroke.points
    )
    const { liveStroke } = store.getState().drawControl
    let shape = null

    // for continuous shapes we draw all sub arrays
    if (liveStroke.type === toolType.PEN) {
        shape = pts.map((subPts, i) => (
            <StrokeShape
                // we can use the array index as key here
                // since the array's order is not changed
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                {...liveStroke}
                points={subPts}
                isDraggable={false}
                isListening={false}
                fillEnabled={false}
                perfectDrawEnabled={false}
                shadowForStrokeEnabled={false}
                currentPageIndex={0}
            />
        ))
    } // for other types (e.g. circle) we only need the endpoints
    else if (liveStroke.points.length > 0) {
        shape = (
            <StrokeShape
                {...liveStroke}
                points={liveStroke.points[0].concat(
                    liveStroke.points[liveStroke.points.length - 1]
                )}
                isDraggable={false}
                isListening={false}
                fillEnabled={false}
                perfectDrawEnabled={false}
                shadowForStrokeEnabled={false}
                currentPageIndex={0}
            />
        )
    }
    return <>{shape}</>
})
