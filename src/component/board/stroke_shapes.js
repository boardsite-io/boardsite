import React, { memo, useState } from "react"
import { Line, Ellipse } from "react-konva"
import { getStartEndPoints } from "./stroke_actions"
import { toolType } from "../../constants"

/**
 * Super component implementing all stroke types and their visualization in the canvas
 * In order for memo to work correctly, we have to pass the stroke props by value
 * referencing an object will result in unwanted rerenders, since we just compare
 * the object references.
 * @param {{stroke: {}}} props
 */
const StrokeShape = memo(({ id, type, style, points, x, y }) => {
    const [isDragging, setDragging] = useState(false)

    let shape
    switch (type) {
        case toolType.PEN:
            shape = (
                <Line
                    id={id}
                    points={points}
                    stroke={style.color}
                    strokeWidth={style.width}
                    tension={0.5}
                    lineCap="round"
                    x={x}
                    y={y}
                    draggable
                    onDragStart={() => setDragging(true)}
                    onDragEnd={() => setDragging(false)}
                    shadowForStrokeEnabled={isDragging}
                    shadowEnabled={isDragging}
                    shadowBlur={isDragging ? 5 : 0}
                    shadowColor="#00ff00"
                    listening
                    perfectDrawEnabled={false}
                />
            )
            break
        case toolType.LINE:
            shape = (
                <Line
                    id={id}
                    points={getStartEndPoints(points)}
                    stroke={style.color}
                    strokeWidth={style.width}
                    tension={1}
                    lineCap="round"
                    x={x}
                    y={y}
                    draggable
                    onDragStart={() => setDragging(true)}
                    onDragEnd={() => setDragging(false)}
                    shadowForStrokeEnabled={isDragging}
                    shadowEnabled={isDragging}
                    shadowBlur={isDragging ? 5 : 0}
                    shadowColor="#00ff00"
                    listening
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
                    id={id}
                    x={points[0] + rad.x}
                    y={points[1] + rad.y}
                    radius={{ x: Math.abs(rad.x), y: Math.abs(rad.y) }}
                    stroke={style.color}
                    strokeWidth={style.width}
                    // fill={props.stroke.style.color}
                    fillEnabled={false} // Remove inner hitbox from empty circles
                    draggable
                    onDragStart={() => setDragging(true)}
                    onDragEnd={() => setDragging(false)}
                    shadowForStrokeEnabled={isDragging}
                    shadowEnabled={isDragging}
                    shadowBlur={isDragging ? 5 : 0}
                    shadowColor="#00ff00"
                    listening
                    perfectDrawEnabled={false}
                />
            )
            break
        }
        default:
            shape = <></>
    }

    return shape
})

export default StrokeShape
