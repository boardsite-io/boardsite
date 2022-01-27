import React, { memo, useCallback, useEffect, useState } from "react"
import { ERASED_OPACITY, LAYER_CACHE_PXL, MOVE_OPACITY } from "consts"
import { useCustomSelector } from "hooks"
import { Stroke } from "drawing/stroke/index.types"
import { LiveStroke } from "drawing/livestroke/index.types"
import { LineCap, LineJoin } from "konva/lib/Shape"
import { Group as GroupType } from "konva/lib/Group"
import Shape from "../Shape"

interface StrokeShapeProps {
    stroke: Stroke | LiveStroke
    groupRef?: React.RefObject<GroupType>
}

/**
 * Super component implementing all stroke types and their visualization in the canvas
 * In order for memo to work correctly, we have to pass the stroke props by value
 * referencing an object will result in unwanted rerenders, since we just compare
 * the object references.
 */
const StrokeShape = memo<StrokeShapeProps>(({ stroke, groupRef }) => {
    const [isDragging, setDragging] = useState(false)
    const erasedStrokes = useCustomSelector(
        (state) => state.drawing.erasedStrokes
    )

    // used to trigger a stroke redraw for positional updates
    const propUpdate = useCustomSelector((state) => {
        const s =
            state.board.pageCollection[stroke.pageId]?.strokes[stroke.id ?? ""]

        return {
            x: s?.x,
            y: s?.y,
            scaleX: s?.scaleX,
            scaleY: s?.scaleY,
        }
    })

    useEffect(() => {
        const pageLayer = groupRef?.current?.parent
        if (pageLayer) {
            pageLayer.clearCache()
            pageLayer.cache({ pixelRatio: LAYER_CACHE_PXL })
        }
    }, [propUpdate])

    const getOpacity = useCallback((): number => {
        if (isDragging) {
            return MOVE_OPACITY
        }

        if (erasedStrokes[stroke.id ?? ""]) {
            return ERASED_OPACITY
        }

        return stroke.style.opacity
    }, [isDragging, erasedStrokes])

    const onDragStart = useCallback((): void => {
        setDragging(true)
    }, [])

    const onDragEnd = useCallback((): void => {
        setDragging(false)
    }, [])

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
        points: stroke.points, // external supplied points may overwrite stroke.points for e.g. livestroke
    }

    return <Shape stroke={stroke} shapeProps={shapeProps} />
})

export default StrokeShape
