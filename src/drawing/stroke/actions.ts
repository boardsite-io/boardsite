import { KonvaEventObject } from "konva/types/Node"
import { getSelectedShapes } from "drawing/stroke/hitbox"
import { LiveStroke, Point, ToolType } from "./types"
import store from "../../redux/store"
import {
    UPDATE_LIVESTROKE,
    END_LIVESTROKE,
    SET_TYPE,
    SET_ISMOUSEDOWN,
    SET_TR_NODES,
    SET_ERASED_STROKES,
} from "../../redux/slice/drawcontrol"
import { handleAddStroke, handleDeleteStrokes } from "../handlers"

let tid: number | NodeJS.Timeout = 0

/**
 * Start the current stroke when mouse is pressed down
 * @param {*} point
 */
export function startLiveStroke(point: Point, pageId: string): void {
    const liveStroke = getLiveStroke()
    liveStroke.start(point, pageId)

    // set Line type when mouse hasnt moved for 1 sec
    if (liveStroke.type === ToolType.Pen) {
        tid = setTimeout(() => {
            store.dispatch(SET_TYPE(ToolType.Line))
        }, 1000)
    }
}

/**
 * Update the live stroke when position is moved in the canvas
 * @param {*} point
 */
export function moveLiveStroke(point: Point): void {
    const liveStroke = getLiveStroke()
    const stageScale = store.getState().viewControl.stageScale.x
    liveStroke.addPoint(point, stageScale)

    // the eraser livestroke calculates the collision of the line
    // between the 2 latest points and all strokes in the page
    if (liveStroke.type === ToolType.Eraser) {
        moveEraser(liveStroke)
    }

    store.dispatch(UPDATE_LIVESTROKE())

    // check if mouse is stationary, else disable switchToLine
    if (tid !== 0 && getLiveStroke().type === ToolType.Pen) {
        const { pointsSegments } = getLiveStroke()
        if (
            Math.abs((pointsSegments ?? [])[0][0] - point.x) >
                2 / store.getState().viewControl.stageScale.x ||
            Math.abs((pointsSegments ?? [])[0][1] - point.y) >
                2 / store.getState().viewControl.stageScale.x
        ) {
            clearTimeout(tid as number)
            tid = 0
        }
    }
}

/**
 * Generate API serialized stroke object, draw & save it to redux store
 */
export async function registerLiveStroke(
    e: KonvaEventObject<MouseEvent>
): Promise<void> {
    const liveStroke = getLiveStroke()
    const stageScale = store.getState().viewControl.stageScale.x
    const pageIndex = getPageIndex(liveStroke.pageId)

    // Finalize & Create stroke from LiveStroke
    const stroke = liveStroke.finalize(stageScale, pageIndex)

    switch (stroke.type) {
        case ToolType.Eraser: {
            const { erasedStrokes } = store.getState().drawControl
            const s = Object.keys(erasedStrokes).map((id) => erasedStrokes[id])
            if (s.length > 0) {
                handleDeleteStrokes(s)
            }
            break
        }
        case ToolType.Select: {
            const { strokes } =
                store.getState().boardControl.pageCollection[stroke.pageId]
            const shapes = getSelectedShapes(stroke, strokes, e)
            store.dispatch(SET_TR_NODES(shapes))
            break
        }
        default:
            handleAddStroke(stroke)
    }

    // notify the livestroke renderer
    store.dispatch(END_LIVESTROKE())

    if (tid !== 0) {
        store.dispatch(SET_TYPE(ToolType.Pen))
        clearTimeout(tid as number)
        tid = 0
    }
}

export function abortLiveStroke(): void {
    if (tid !== 0) {
        clearTimeout(tid as number)
        tid = 0
    }
    const liveStroke = getLiveStroke()
    if (liveStroke.pointsSegments?.length) {
        store.dispatch(END_LIVESTROKE())
    }
    if (store.getState().drawControl.isMouseDown) {
        store.dispatch(SET_ISMOUSEDOWN(false))
    }
}

export function getPageIndex(pageId: string): number {
    return store.getState().boardControl.pageRank.indexOf(pageId)
}

// helper function to get current livestroke
function getLiveStroke() {
    return store.getState().drawControl.liveStroke
}

function moveEraser(liveStroke: LiveStroke): void {
    const { strokes } =
        store.getState().boardControl.pageCollection[liveStroke.pageId]
    const selectedStrokes = liveStroke.selectLineCollision(strokes)
    if (Object.keys(selectedStrokes).length > 0) {
        store.dispatch(SET_ERASED_STROKES(selectedStrokes))
    }
}
