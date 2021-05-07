import React, { memo, useRef, useState } from "react"
import { Line, Ellipse, Circle, Rect } from "react-konva"
import { getStartEndPoints } from "./stroke_actions"
import { DRAG_SHADOW_BLUR, toolType } from "../../constants"

/**
 * Super component implementing all stroke types and their visualization in the canvas
 * In order for memo to work correctly, we have to pass the stroke props by value
 * referencing an object will result in unwanted rerenders, since we just compare
 * the object references.
 * @param {{stroke: {}}} props
 */
export default memo(({ id, type, style, points, x, y, isSelected }) => {
    const shapeRef = useRef()
    const [isDragging, setDragging] = useState(false)
    const shapeProps = {
        name: "shape",
        ref: shapeRef,
        id,
        x,
        y,
        lineCap: "round",
        lineJoin: "round",
        stroke: isSelected ? "#ff00ff" : style.color,
        // fill: style.color,
        strokeWidth: style.width,
        draggable: !isSelected,
        listening: !isSelected,
        perfectDrawEnabled: false,
        onDragStart: () => setDragging(true),
        onDragEnd: () => {
            setDragging(false)
        },
        // onTransformEnd: (e) => {
        //     // transformer is changing scale of the node
        //     // and NOT its width or height
        //     // but in the store we have only width and height
        //     // to match the data better we will reset scale on transform end
        //     const node = shapeRef.current
        //     const scaleX = node.scaleX()
        //     const scaleY = node.scaleY()

        //     // we will reset it back
        //     node.scaleX(1)
        //     node.scaleY(1)
        //     onChange({
        //         ...shapeProps,
        //         x: node.x(),
        //         y: node.y(),
        //         // set minimal value
        //         width: Math.max(5, node.width() * scaleX),
        //         height: Math.max(node.height() * scaleY),
        //     })
        // },
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
        case toolType.SELECT: {
            const plen = points.length
            const width = points[plen - 2] - points[0]
            const height = points[plen - 1] - points[1]
            shape = (
                <Rect
                    {...shapeProps}
                    x={points[0]}
                    y={points[1]}
                    width={width}
                    height={height}
                    fillEnabled={false} // Remove inner hitbox from empty circles
                />
            )
            break
        }
        default:
            shape = <></>
    }

    return shape
})

/**
 * Function to draw circles at stroke points.
 * @param {*} points
 * @param {*} width
 */
export function debugStrokePoints(points, width) {
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
