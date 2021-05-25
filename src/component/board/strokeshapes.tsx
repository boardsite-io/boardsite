import React, { memo, useRef, useState } from "react"
import { Line, Ellipse, Circle, Rect } from "react-konva"
import { LineJoin, LineCap } from "konva/types/Shape"
import { getStartEndPoints } from "../../drawing/strokeactions"
import {
    DRAG_SHADOW_BLUR,
    SEL_FILL,
    SEL_FILL_ENABLED,
    SEL_STROKE,
    SEL_STROKE_ENABLED,
    toolType,
} from "../../constants"
import { Point, StrokeShape } from "../../types"
import { useCustomSelector } from "../../redux/hooks"
import store from "../../redux/store"
import { handleUpdateStroke } from "../../drawing/handlers"

/**
 * Super component implementing all stroke types and their visualization in the canvas
 * In order for memo to work correctly, we have to pass the stroke props by value
 * referencing an object will result in unwanted rerenders, since we just compare
 * the object references.
 * @param {{stroke: {}}} props
 */
export default memo<StrokeShape>(
    ({ x, y, id, scaleX, scaleY, pageId, type, style, points }) => {
        const [isDragging, setDragging] = useState(false)
        const isDraggable = useCustomSelector(
            (state) => state.drawControl.isDraggable
        )
        const shapeRef = useRef()
        const shapeProps = {
            name: "shape",
            ref: shapeRef,
            x,
            y,
            id,
            scaleX,
            scaleY,
            lineCap: "round" as LineCap,
            lineJoin: "round" as LineJoin,
            stroke: style.color,
            // fill: style.color,
            strokeWidth: style.width,
            draggable: isDraggable,
            listening: true,
            perfectDrawEnabled: false,
            onDragStart: () => setDragging(true),
            onDragEnd: (e: any) => {
                setDragging(false)
                if (
                    store.getState().drawControl.liveStroke.type !==
                    toolType.ERASER
                ) {
                    handleUpdateStroke({
                        x: e.target.attrs.x,
                        y: e.target.attrs.y,
                        id,
                        scaleX: e.target.attrs.scaleX,
                        scaleY: e.target.attrs.scaleY,
                        pageId,
                    })
                }
            },
            onTransformEnd: (e: any) => {
                handleUpdateStroke({
                    x: e.target.attrs.x,
                    y: e.target.attrs.y,
                    id,
                    scaleX: e.target.attrs.scaleX,
                    scaleY: e.target.attrs.scaleY,
                    pageId,
                })
            },
            shadowForStrokeEnabled: isDragging,
            shadowEnabled: isDragging,
            shadowBlur: isDragging ? DRAG_SHADOW_BLUR : 0,
            shadowColor: style.color,
        }
        let shape
        switch (type) {
            case toolType.PEN:
                shape = <Line {...shapeProps} points={points} tension={0.3} />
                break
            case toolType.LINE:
                shape = (
                    <Line
                        {...shapeProps}
                        points={getStartEndPoints(points)}
                        tension={1}
                        perfectDrawEnabled={false}
                    />
                )
                break
            case toolType.CIRCLE: {
                const rad = {
                    x: (points[points.length - 2] - points[0]) / 2,
                    y: (points[points.length - 1] - points[1]) / 2,
                }
                shape = (
                    <Ellipse
                        {...shapeProps}
                        radius={{ x: Math.abs(rad.x), y: Math.abs(rad.y) }}
                        fillEnabled={false} // Remove inner hitbox from empty circles
                    />
                )
                break
            }
            case toolType.RECTANGLE: {
                const plen = points.length
                const width = points[plen - 2] - points[0]
                const height = points[plen - 1] - points[1]
                shape = (
                    <Rect
                        {...shapeProps}
                        width={width}
                        height={height}
                        fillEnabled
                    />
                )
                break
            }
            case toolType.SELECT: {
                const plen = points.length
                const width = points[plen - 2] - points[0]
                const height = points[plen - 1] - points[1]
                shape = (
                    <Rect
                        {...shapeProps}
                        width={width}
                        height={height}
                        stroke={SEL_STROKE}
                        strokeEnabled={SEL_STROKE_ENABLED}
                        fill={SEL_FILL}
                        fillEnabled={SEL_FILL_ENABLED}
                    />
                )
                break
            }
            default:
                shape = <></>
        }

        return shape
    }
)

/**
 * Function to draw circles at stroke points.
 * @param {*} points
 * @param {*} width
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
