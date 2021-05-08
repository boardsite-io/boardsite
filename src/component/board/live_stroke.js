import React, { memo } from "react"
import { useSelector } from "react-redux"
import { toolType } from "../../constants"
import store from "../../redux/store"
import StrokeShape from "./stroke_shapes"

export default memo(() => {
    // console.log("LiveLayer Memo Redraw")
    const pts = useSelector((state) => state.drawControl.liveStroke.points)
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
        if (liveStroke.type === toolType.CIRCLE) {
            const points = liveStroke.points[0].concat(
                liveStroke.points[liveStroke.points.length - 1]
            )
            const rad = {
                x: (points[points.length - 2] - points[0]) / 2,
                y: (points[points.length - 1] - points[1]) / 2,
            }

            shape = (
                <StrokeShape
                    {...liveStroke}
                    points={liveStroke.points[0].concat(
                        liveStroke.points[liveStroke.points.length - 1]
                    )}
                    x={points[0] + rad.x}
                    y={points[1] + rad.y}
                    isDraggable={false}
                    isListening={false}
                    fillEnabled={false}
                    perfectDrawEnabled={false}
                    shadowForStrokeEnabled={false}
                    currentPageIndex={0}
                />
            )
        } else {
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
    }
    return <>{shape}</>
})
