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
export function getStartEndPoints(points) {
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
