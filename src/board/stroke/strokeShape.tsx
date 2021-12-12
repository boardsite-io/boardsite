import React, { memo, useState } from "react"
import { ERASED_OPACITY, MOVE_OPACITY } from "consts"
import { useCustomSelector } from "hooks"
import { Stroke } from "drawing/stroke/index.types"
import { LiveStroke } from "drawing/livestroke/index.types"
import { LineCap, LineJoin } from "konva/lib/Shape"
import { Shape } from "./shape"

interface StrokeShapeProps {
    stroke: Stroke | LiveStroke
}

/**
 * Super component implementing all stroke types and their visualization in the canvas
 * In order for memo to work correctly, we have to pass the stroke props by value
 * referencing an object will result in unwanted rerenders, since we just compare
 * the object references.
 */
export const StrokeShape = memo<StrokeShapeProps>(({ stroke }) => {
    const [isDragging, setDragging] = useState(false)
    const erasedStrokes = useCustomSelector(
        (state) => state.drawing.erasedStrokes
    )

    // used to trigger a stroke redraw for positional updates
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const strokeSel = useCustomSelector((state) => {
        const s =
            state.board.pageCollection[stroke.pageId]?.strokes[stroke.id ?? ""]
        return {
            x: s?.x,
            y: s?.y,
            scaleX: s?.scaleX,
            scaleY: s?.scaleY,
        }
    })

    const getOpacity = (): number => {
        if (isDragging) {
            return MOVE_OPACITY
        }
        if (erasedStrokes[stroke.id ?? ""]) {
            return ERASED_OPACITY
        }
        return stroke.style.opacity
    }

    const onDragStart = () => {
        setDragging(true)
    }
    const onDragEnd = () => {
        setDragging(false)
    }

    const shapeProps = {
        name: stroke.pageId, // required to find via selector
        id: stroke.id,
        x: stroke.x,
        y: stroke.y,
        scaleX: stroke.scaleX,
        scaleY: stroke.scaleY,
        lineCap: "round" as LineCap,
        lineJoin: "round" as LineJoin,
        stroke: stroke.style.color,
        fill: undefined,
        strokeWidth: stroke.style.width,
        opacity: getOpacity(),
        listening: false,
        draggable: false,
        onDragStart,
        onDragEnd,
        shadowForStrokeEnabled: false, // for performance, see Konva docs
        // external supplied points may overwrite stroke.points for e.g. livestroke
        points:
            stroke.points.length >= 4
                ? stroke.points
                : [...stroke.points, ...stroke.points], // first point needs copy for rectangles
    }

    return <Shape stroke={stroke} shapeProps={shapeProps} />
})
