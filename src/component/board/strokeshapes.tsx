import React, { memo, useState } from "react"
import { Line, Ellipse, Circle } from "react-konva"
import { getStartEndPoints } from "../../drawing/strokeactions"
import { DRAG_SHADOW_BLUR, toolType } from "../../constants"
import { Stroke } from "../../types"
import { Line as LineType } from "konva/types/shapes/Line"

/**
 * Super component implementing all stroke types and their visualization in the canvas
 * In order for memo to work correctly, we have to pass the stroke props by value
 * referencing an object will result in unwanted rerenders, since we just compare
 * the object references.
 * @param {{stroke: {}}} props
 */
export const StrokeShape: React.FC<Stroke> = memo(
    ({ id, type, style, points, x, y }) => {
        const [isDragging, setDragging] = useState(false)
        const shapeProps = {
            id,
            x,
            y,
            lineCap: "round",
            lineJoin: "round",
            stroke: style.color,
            // fill: style.color,
            strokeWidth: style.width,
            draggable: true,
            listening: true,
            perfectDrawEnabled: false,
            onDragStart: () => setDragging(true),
            onDragEnd: () => setDragging(false),
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
            // case type.TRIANGLE:
            //     shape = (
            //         <Line
            //             points={props.stroke.points}
            //             stroke={props.stroke.style.color}
            //             strokeWidth={props.stroke.style.width}
            //             tension={1}
            //             lineCap="round"
            //             draggable={props.isDraggable}
            //             draggable
            //             listening
            //         />
            //     )
            //     break
            case toolType.CIRCLE: {
                const rad = {
                    x: (points[points.length - 2] - points[0]) / 2,
                    y: (points[points.length - 1] - points[1]) / 2,
                }
                shape = (
                    <Ellipse
                        {...shapeProps}
                        x={points[0] + rad.x}
                        y={points[1] + rad.y}
                        radius={{ x: Math.abs(rad.x), y: Math.abs(rad.y) }}
                        fillEnabled={false} // Remove inner hitbox from empty circles
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
export function debugStrokePoints(points: number[], width: number) {
    const pts = []
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
