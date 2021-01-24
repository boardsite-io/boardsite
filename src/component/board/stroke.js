import React from "react"
import { Line, Ellipse } from "react-konva"
import store from "../../redux/store"
import {
    actAddStroke,
    actEraseStroke,
    actUpdateStroke,
} from "../../redux/slice/boardcontrol"
import {
    actStartLiveStroke,
    actUpdateLiveStrokePos,
    actEndLiveStroke,
} from "../../redux/slice/drawcontrol"
import { toolType } from "../../constants"
// import * as constant from '../constants.js';

/**
 * Super component implementing all stroke types and their visualization in the canvas
 * @param {{stroke: {}}} props
 */
export function StrokeShape({ stroke, isDraggable }) {
    function onDragStart() {
        // succ
    }

    function onDragEnd(e) {
        store.dispatch(
            actUpdateStroke({
                x: e.target.attrs.x,
                y: e.target.attrs.y,
                id: stroke.id,
                pageId: stroke.pageId,
            })
        )
    }

    function handleStrokeMouseEnter(e) {
        // prevent to act on live stroke
        if (stroke.id === undefined) {
            return
        }

        if (
            store.getState().drawControl.liveStroke.type === toolType.ERASER ||
            e.evt.buttons === 2
        ) {
            store.dispatch(actEraseStroke(stroke))
        }
    }

    let shape
    switch (stroke.type) {
        case toolType.PEN:
            shape = (
                <Line
                    points={stroke.points}
                    stroke={stroke.style.color}
                    strokeWidth={stroke.style.width}
                    tension={0.5}
                    lineCap="round"
                    onMouseEnter={handleStrokeMouseEnter}
                    draggable={isDraggable}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    x={stroke.x}
                    y={stroke.x}
                />
            )
            break
        case toolType.LINE:
            shape = (
                <Line
                    points={getStartEndPoints(stroke.points)}
                    stroke={stroke.style.color}
                    strokeWidth={stroke.style.width}
                    tension={1}
                    lineCap="round"
                    onMouseEnter={handleStrokeMouseEnter}
                    draggable={isDraggable}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    x={stroke.x}
                    y={stroke.y}
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
        //             onMouseEnter={(e) =>
        //                 handleStrokeMouseEnter(e, props.stroke)
        //             }
        //             draggable={props.isDraggable}
        //             onDragStart={onDragStart}
        //             onDragEnd={onDragEnd}
        //         />
        //     )
        //     break
        case toolType.CIRCLE: {
            const rad = {
                x:
                    (stroke.points[stroke.points.length - 2] -
                        stroke.points[0]) /
                    2,
                y:
                    (stroke.points[stroke.points.length - 1] -
                        stroke.points[1]) /
                    2,
            }
            shape = (
                <Ellipse
                    x={stroke.points[0] + rad.x}
                    y={stroke.points[1] + rad.y}
                    radius={{ x: Math.abs(rad.x), y: Math.abs(rad.y) }}
                    stroke={stroke.style.color}
                    strokeWidth={stroke.style.width}
                    // fill={props.stroke.style.color}
                    onMouseEnter={handleStrokeMouseEnter}
                    draggable={isDraggable}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                />
            )
            break
        }
        default:
            shape = <></>
    }

    return shape
}

/**
 * Start the current stroke when mouse is pressed down
 * @param {*} position
 */
export function startLiveStroke(position, pageId) {
    store.dispatch(
        actStartLiveStroke({
            pageId,
            points: [position.x, position.y],
        })
    )
}

/**
 * Update the live stroke when position is moved in the canvas
 * @param {*} position
 */
export function moveLiveStroke(position) {
    store.dispatch(actUpdateLiveStrokePos([position.x, position.y]))
}

/**
 * Generate API serialized stroke object, draw & save it to redux store
 * @param {*} pageId
 */
export async function registerLiveStroke() {
    let { liveStroke } = store.getState().drawControl
    // empty livestrokes e.g. rightmouse eraser
    if (liveStroke.points[liveStroke.pageId] === undefined) {
        return
    }
    if (liveStroke.type === toolType.ERASER) {
        return
    }

    liveStroke = {
        ...liveStroke,
        id:
            Math.random()
                .toString(36)
                .replace(/[^a-z]+/g, "")
                .substr(0, 4) + Date.now().toString(36).substr(4),
        points: liveStroke.points[liveStroke.pageId],
    }

    // add stroke to collection
    store.dispatch(actAddStroke(liveStroke))

    // clear livestroke
    store.dispatch(actEndLiveStroke())
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
