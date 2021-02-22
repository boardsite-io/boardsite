import React, { memo } from "react"
import { Line, Ellipse, Circle } from "react-konva"
import store from "../../redux/store"
import {
    ADD_STROKE,
    ERASE_STROKE,
    UPDATE_STROKE,
} from "../../redux/slice/boardcontrol"
import {
    START_LIVESTROKE,
    UPDATE_LIVESTROKE,
    END_LIVESTROKE,
} from "../../redux/slice/drawcontrol"
import { sendStroke, eraseStroke } from "../../api/websocket"

import {
    toolType,
    CANVAS_FULL_HEIGHT,
    RDP_EPSILON,
    LIVESTROKE_PTS_OVERLAP,
} from "../../constants"
import { simplifyRDP } from "../../util/simplify"
/**
 * Super component implementing all stroke types and their visualization in the canvas
 * In order for memo to work correctly, we have to pass the stroke props by value
 * referencing an object will result in unwanted rerenders, since we just compare
 * the object references.
 * @param {{stroke: {}}} props
 */
export const StrokeShape = memo(({ id, pageId, type, style, points, x, y }) => {
    // function onDragStart() {
    //     if (store.getState().drawControl.liveStroke.type === toolType.ERASER) {
    //         store.dispatch(ERASE_STROKE({ pageId, id }))
    //     }
    // }

    function onDragEnd(e) {
        if (store.getState().drawControl.liveStroke.type !== toolType.ERASER) {
            const s = {
                x: e.target.attrs.x,
                y: e.target.attrs.y,
                id,
                type,
                pageId,
                style,
                points,
            }
            store.dispatch(UPDATE_STROKE(s))
            sendStroke(s) // ws
        }
    }

    function handleStrokeMovement(e) {
        // prevent to act on live stroke
        if (id === undefined) {
            return
        }

        if (
            (store.getState().drawControl.liveStroke.type === toolType.ERASER &&
                e.evt.buttons === 1) ||
            e.evt.buttons === 2
        ) {
            store.dispatch(ERASE_STROKE({ pageId, id }))
            eraseStroke({ pageId, id }) // ws
        }
    }

    let shape
    switch (type) {
        case toolType.PEN:
            shape = (
                <Line
                    points={points}
                    stroke={style.color}
                    strokeWidth={style.width}
                    tension={0.3}
                    lineCap="round"
                    lineJoin="round"
                    onMouseDown={handleStrokeMovement}
                    onMouseMove={handleStrokeMovement}
                    onMouseEnter={handleStrokeMovement}
                    // onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    x={x}
                    y={y}
                    draggable
                    listening
                    perfectDrawEnabled={false}
                    shadowForStrokeEnabled={false}
                />
            )
            break
        case toolType.LINE:
            shape = (
                <Line
                    points={getStartEndPoints(points)}
                    stroke={style.color}
                    strokeWidth={style.width}
                    tension={1}
                    lineCap="round"
                    onMouseDown={handleStrokeMovement}
                    onMouseMove={handleStrokeMovement}
                    onMouseEnter={handleStrokeMovement}
                    // onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    x={x}
                    y={y}
                    draggable
                    listening
                    perfectDrawEnabled={false}
                    shadowForStrokeEnabled={false}
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
        //             onMouseDown={handleStrokeMovement}
        //             onMouseMove={handleStrokeMovement}
        //             onMouseEnter={handleStrokeMovement}
        //             draggable={props.isDraggable}
        //             onDragStart={onDragStart}
        //             onDragEnd={onDragEnd}
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
                    x={points[0] + rad.x}
                    y={points[1] + rad.y}
                    radius={{ x: Math.abs(rad.x), y: Math.abs(rad.y) }}
                    stroke={style.color}
                    strokeWidth={style.width}
                    // fill={props.stroke.style.color}
                    onMouseDown={handleStrokeMovement}
                    onMouseMove={handleStrokeMovement}
                    onMouseEnter={handleStrokeMovement}
                    // onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    fillEnabled={false} // Remove inner hitbox from empty circles
                    draggable
                    listening
                    perfectDrawEnabled={false}
                    shadowForStrokeEnabled={false}
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
export async function registerLiveStroke(pageId) {
    const { liveStroke } = store.getState().drawControl
    // empty livestrokes e.g. rightmouse eraser
    if (liveStroke.points.length === 0) {
        return
    }
    if (liveStroke.type === toolType.ERASER) {
        return
    }

    const stroke = createStroke(liveStroke, pageId)
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
function createStroke(liveStroke, pageId) {
    const stroke = { ...liveStroke }
    stroke.points = flatLiveStroke(stroke.points)

    // add page ids
    stroke.pageId = pageId

    // generate a unique stroke id
    stroke.id =
        Date.now().toString(36).substr(2) +
        Math.random().toString(36).substr(2, 10)

    // for some types we only need a few points
    switch (liveStroke.type) {
        case toolType.PEN:
            stroke.points = simplifyRDP(stroke.points, RDP_EPSILON)
            break
        case toolType.LINE:
            stroke.points = getStartEndPoints(stroke.points)
            break
        case toolType.CIRCLE:
            stroke.points = getStartEndPoints(stroke.points)
            break
        default:
    }

    const currentPageIndex = getPageIndex(pageId)
    stroke.points = stroke.points.map((p, i) => {
        // allow a reasonable precision
        let pt = Math.round(p * 10) / 10
        if (i % 2) {
            // make y coordinates relative to page
            pt -= currentPageIndex * CANVAS_FULL_HEIGHT // relative y position
        }
        return pt
    })

    return stroke
}

export function getPageIndex(pageId) {
    return store.getState().boardControl.present.pageRank.indexOf(pageId)
}

/**
 * Combine the substrokes and delete the overlapping points.
 * @param {[[number]]} points array of sub livestrokes
 */
function flatLiveStroke(points) {
    if (points.length === 0) {
        return []
    }
    if (points.length === 1) {
        return points[0]
    }
    let pts = []
    for (let i = 0; i < points.length - 1; i += 1) {
        pts = pts.concat(
            points[i].slice(0, points[i].length - 2 * LIVESTROKE_PTS_OVERLAP)
        )
    }
    pts = pts.concat(points[points.length - 1])

    return pts
}
