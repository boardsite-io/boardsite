import store from "../redux/store"
import {
    START_LIVESTROKE,
    UPDATE_LIVESTROKE,
    END_LIVESTROKE,
    SET_TYPE,
    SET_ISMOUSEDOWN,
} from "../redux/slice/drawcontrol"
import { simplifyRDP } from "./simplify"

import {
    toolType,
    CANVAS_FULL_HEIGHT,
    RDP_EPSILON,
    LIVESTROKE_PTS_OVERLAP,
    RDP_FORCE_SECTIONS,
} from "../constants"
import { handleAddStroke } from "./handlers"

let tid = 0

/**
 * Start the current stroke when mouse is pressed down
 * @param {*} point
 */
export function startLiveStroke(point) {
    store.dispatch(START_LIVESTROKE([point.x, point.y]))
    // set Line type when mouse hasnt moved for 1 sec
    if (getLiveStroke().type === toolType.PEN) {
        tid = setTimeout(() => {
            store.dispatch(SET_TYPE(toolType.LINE))
        }, 1000)
    }
}

/**
 * Update the live stroke when position is moved in the canvas
 * @param {*} point
 */
export function moveLiveStroke(point) {
    store.dispatch(
        UPDATE_LIVESTROKE({
            point,
            scale: store.getState().viewControl.stageScale.x,
        })
    )
    // check if mouse is stationary, else disable switchToLine
    if (tid !== 0 && getLiveStroke().type === toolType.PEN) {
        const { points } = getLiveStroke()
        if (
            Math.abs(points[0][0] - point.x) >
                2 / store.getState().viewControl.stageScale.x ||
            Math.abs(points[0][1] - point.y) >
                2 / store.getState().viewControl.stageScale.x
        ) {
            clearTimeout(tid)
            tid = 0
        }
    }
}

/**
 * Generate API serialized stroke object, draw & save it to redux store
 */
export async function registerLiveStroke(pageId) {
    const liveStroke = getLiveStroke()
    // empty livestrokes e.g. rightmouse eraser
    if (liveStroke.points === undefined) {
        return
    }
    if (liveStroke.type === toolType.ERASER) {
        return
    }

    handleAddStroke(createStroke(liveStroke, pageId, true))
    store.dispatch(END_LIVESTROKE())

    if (tid !== 0) {
        store.dispatch(SET_TYPE(toolType.PEN))
        clearTimeout(tid)
        tid = 0
    }
}

export function abortLiveStroke() {
    if (tid !== 0) {
        clearTimeout(tid)
        tid = 0
    }
    const liveStroke = getLiveStroke()
    if (liveStroke.points.length > 0) {
        store.dispatch(END_LIVESTROKE())
    }
    if (store.getState().drawControl.isMouseDown) {
        store.dispatch(SET_ISMOUSEDOWN(false))
    }
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
function createStroke(liveStroke, pageId, simplify) {
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
            if (simplify) {
                stroke.points = simplifyRDP(
                    stroke.points,
                    RDP_EPSILON / 2 / store.getState().viewControl.stageScale.x,
                    RDP_FORCE_SECTIONS
                )
            }
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

// helper function to get current livestroke
function getLiveStroke() {
    return store.getState().drawControl.liveStroke
}
