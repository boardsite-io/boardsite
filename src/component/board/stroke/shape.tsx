import React, { memo, useState } from "react"
import { Circle } from "react-konva"
import { LineJoin, LineCap } from "konva/types/Shape"
import { Point, Stroke } from "../../../types"
import { useCustomSelector } from "../../../redux/hooks"
import store from "../../../redux/store"
import { MOVE_OPACITY } from "../../../constants"

interface StrokeShapeProps {
    stroke: Stroke
    points?: number[]
}

/**
 * Super component implementing all stroke types and their visualization in the canvas
 * In order for memo to work correctly, we have to pass the stroke props by value
 * referencing an object will result in unwanted rerenders, since we just compare
 * the object references.
 */
export const StrokeShape = memo<StrokeShapeProps>(({ stroke, points }) => {
    const [isDragging, setDragging] = useState(false)
    // Tmp Fix: selector for x,y,scale in order to trigger
    // a rerender when stroke is updated/moved
    const strokeSel = useCustomSelector((state) => {
        const { isDraggable } = state.drawControl
        const s =
            state.boardControl.pageCollection[stroke.pageId]?.strokes[stroke.id]
        return {
            isDraggable,
            x: s?.x,
            y: s?.y,
            scaleX: s?.scaleX,
            scaleY: s?.scaleY,
        }
    })

    const shapeProps = {
        name: stroke.pageId, // required to find via selector
        id: stroke.id ?? "",
        x: strokeSel.x ?? stroke.x,
        y: strokeSel.y ?? stroke.y,
        scaleX: strokeSel.scaleX || 1,
        scaleY: strokeSel.scaleY || 1,
        lineCap: "round" as LineCap,
        lineJoin: "round" as LineJoin,
        stroke: stroke.style.color,
        // fill: style.color,
        strokeWidth: stroke.style.width,
        opacity: isDragging ? MOVE_OPACITY : stroke.style.opacity || 1,
        draggable: strokeSel.isDraggable ?? false,
        onDragStart: () => setDragging(true),
        onDragEnd: () => setDragging(false),
        listening: true,
        shadowForStrokeEnabled: false, // for performance, see Konva docs
        points: points || stroke.points, // external supplied points may overwrite stroke.points for e.g. livestroke
    }

    return stroke.getShape?.(shapeProps) as JSX.Element
})

export const LiveStrokeShape = memo(() => {
    const { liveStroke } = store.getState().drawControl
    // trigger rerender when livestroke is updated
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const u = useCustomSelector((state) => state.drawControl.liveStrokeUpdate)
    const shape = liveStroke.pointsSegments?.map(
        (subPts: number[], i: number) => (
            <StrokeShape
                // we can use the array index as key here
                // since the array's order is not changed
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                stroke={liveStroke as unknown as Stroke}
                points={subPts.slice()} // copy to trigger update
            />
        )
    )
    return <>{shape}</>
})

/**
 * Function to draw circles at stroke points.
 */
export function debugStrokePoints(
    points: number[],
    width: number
): JSX.Element {
    const pts: Point[] = []
    for (let i = 0; i < points.length; i += 2) {
        pts.push({ x: points[i], y: points[i + 1] })
    }
    return (
        <>
            {pts.map((pt, i) => (
                <Circle
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    x={pt.x}
                    y={pt.y}
                    radius={width / 2}
                    fill="#ff0000"
                    strokeWidth={0}
                />
            ))}
        </>
    )
}
