import store from "../../redux/store"
import {
    START_LIVESTROKE,
    UPDATE_LIVESTROKE,
    END_LIVESTROKE,
} from "../../redux/slice/drawcontrol"
// import { simplifyRDP } from "../../util/simplify"

import {
    toolType,
    CANVAS_FULL_HEIGHT,
    // RDP_EPSILON,
    LIVESTROKE_PTS_OVERLAP,
} from "../../constants"
import { handleAddStroke } from "./request_handlers"

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

    handleAddStroke(stroke)
    // clear livestroke
    store.dispatch(END_LIVESTROKE())
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
            // stroke.points = simplifyRDP(stroke.points, RDP_EPSILON)
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
    return store.getState().boardControl.pageRank.indexOf(pageId)
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
