import React, { memo, useState } from "react"
import { Line, Ellipse } from "react-konva"
import store from "../../redux/store"
import { ADD_STROKE } from "../../redux/slice/boardcontrol"
import {
    START_LIVESTROKE,
    UPDATE_LIVESTROKE,
    END_LIVESTROKE,
} from "../../redux/slice/drawcontrol"
import { sendStroke } from "../../api/websocket"

import { toolType, CANVAS_FULL_HEIGHT } from "../../constants"
/**
 * Super component implementing all stroke types and their visualization in the canvas
 * In order for memo to work correctly, we have to pass the stroke props by value
 * referencing an object will result in unwanted rerenders, since we just compare
 * the object references.
 * @param {{stroke: {}}} props
 */
export const StrokeShape = memo(({ id, type, style, points, x, y }) => {
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

/**
 * Start the current stroke when mouse is pressed down
 * @param {*} position
 */
export function startLiveStroke(position) {
    store.dispatch(START_LIVESTROKE([position.x, position.y]))
}

/**
 * Update the live stroke when position is moved in the canvas
 * @param {*} position
 */
export function moveLiveStroke(position) {
    store.dispatch(UPDATE_LIVESTROKE([position.x, position.y]))
}

/**
 * Generate API serialized stroke object, draw & save it to redux store
 */
export async function registerLiveStroke(pageId, currentPageIndex) {
    const { liveStroke } = store.getState().drawControl
    // empty livestrokes e.g. rightmouse eraser
    if (liveStroke.points === undefined) {
        return
    }
    if (liveStroke.type === toolType.ERASER) {
        return
    }

    const stroke = createStroke(liveStroke, pageId, currentPageIndex)
    // add stroke to collection
    store.dispatch(ADD_STROKE(stroke))
    // clear livestroke
    store.dispatch(END_LIVESTROKE())
    // relay stroke in session
    sendStroke(stroke)
}

/**
 * Helper function to get the end and start points of an array of points
 * @param {Array} points
 */
function getStartEndPoints(points) {
    if (points.length < 5) {
        return points
    }
    return points
        .slice(0, 2)
        .concat(points.slice(points.length - 2, points.length))
}

/**
 * Creates a new stroke with unique ID and processes the points
 * @param {*} liveStroke
 */
function createStroke(liveStroke, pageId, currentPageIndex) {
    const stroke = { ...liveStroke }
    stroke.points = stroke.points.flat()

    // add page id
    stroke.pageId = pageId

    // generate a unique stroke id
    stroke.id =
        Date.now().toString(36).substr(2) +
        Math.random().toString(36).substr(2, 10)

    // for some types we only need a few points
    switch (liveStroke.type) {
        case toolType.PEN:
            // TODO compression function
            break
        case toolType.LINE:
            stroke.points = getStartEndPoints(stroke.points)
            break
        case toolType.CIRCLE:
            stroke.points = getStartEndPoints(stroke.points)
            break
        default:
    }

    // allow a reasonable precision
    stroke.points = stroke.points.map((p) => Math.round(p * 10) / 10)

    // make y coordinates relative to page
    for (let i = 1; i < stroke.points.length; i += 2) {
        stroke.points[i] -= currentPageIndex * CANVAS_FULL_HEIGHT // relative y position
    }

    return stroke
}
