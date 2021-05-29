import React, { memo, useState } from "react"
import { Circle } from "react-konva"
import { LineJoin, LineCap } from "konva/types/Shape"
import { KonvaEventObject } from "konva/types/Node"
import { Point, Stroke } from "../../../types"
import { useCustomSelector } from "../../../redux/hooks"
import store from "../../../redux/store"
import { handleUpdateStroke } from "../../../drawing/handlers"
import { toolType } from "../../../constants"

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
    const isDraggable = useCustomSelector(
        (state) => state.drawControl.isDraggable
    )
    const onDragEnd = (e: KonvaEventObject<DragEvent>) => {
        setDragging(false)
        if (store.getState().drawControl.liveStroke.type !== toolType.ERASER) {
            handleUpdateStroke({
                x: e.target.attrs.x,
                y: e.target.attrs.y,
                id: stroke.id,
                scaleX: e.target.attrs.scaleX,
                scaleY: e.target.attrs.scaleY,
                pageId: stroke.pageId,
                points: [],
                type: stroke.type,
                style: stroke.style,
            })
        }
    }

    const onTransformEnd = (e: KonvaEventObject<Event>) => {
        handleUpdateStroke({
            x: e.target.attrs.x,
            y: e.target.attrs.y,
            id: stroke.id,
            scaleX: e.target.attrs.scaleX,
            scaleY: e.target.attrs.scaleY,
            pageId: stroke.pageId,
            points: [],
            type: stroke.type,
            style: stroke.style,
        })
    }

    const shapeProps = {
        id: stroke.id || "",
        x: stroke.x || 0,
        y: stroke.y || 0,
        scaleX: stroke.scaleX || 1,
        scaleY: stroke.scaleY || 1,
        lineCap: "round" as LineCap,
        lineJoin: "round" as LineJoin,
        stroke: stroke.style.color,
        // fill: style.color,
        strokeWidth: stroke.style.width,
        opacity: isDragging ? 0.6 : stroke.style.opacity || 1,
        draggable: isDraggable,
        listening: true,
        onDragStart: () => setDragging(true),
        onDragEnd,
        onTransformEnd,
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
                stroke={(liveStroke as unknown) as Stroke}
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
