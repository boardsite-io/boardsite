import { PageMeta } from "types"
import store from "redux/store"
import {
    UPDATE_LIVESTROKE,
    END_LIVESTROKE,
    SET_ISMOUSEDOWN,
    SET_ERASED_STROKES,
} from "redux/drawing/drawing"
import { KonvaEventObject } from "konva/lib/Node"
import { CLEAR_TRANSFORM, MOVE_SHAPES_TO_DRAG_LAYER } from "redux/board/board"
import {
    handleSetTool,
    handleAddStrokes,
    handleDeleteStrokes,
} from "../handlers"
import { LiveStroke, Point, ToolType } from "./types"
import { getSelectionPolygon, matchStrokeCollision } from "./hitbox"

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
            handleSetTool({ type: ToolType.Line })
        }, 1000)
    } else if (liveStroke.type === ToolType.Select) {
        store.dispatch(CLEAR_TRANSFORM())
    }
}

/**
 * Update the live stroke when position is moved in the canvas
 * @param {*} point
 */
export function moveLiveStroke(point: Point, pagePosition: Point): void {
    const liveStroke = getLiveStroke()
    const stageScale = store.getState().board.view.stageScale.x
    liveStroke.addPoint(point, stageScale)

    // the eraser livestroke calculates the collision of the line
    // between the 2 latest points and all strokes in the page
    if (liveStroke.type === ToolType.Eraser) {
        moveEraser(liveStroke, pagePosition)
    }

    store.dispatch(UPDATE_LIVESTROKE())

    // check if mouse is stationary, else disable switchToLine
    if (tid !== 0 && getLiveStroke().type === ToolType.Pen) {
        const { pointsSegments } = getLiveStroke()
        if (
            Math.abs((pointsSegments ?? [])[0][0] - point.x) >
                2 / store.getState().board.view.stageScale.x ||
            Math.abs((pointsSegments ?? [])[0][1] - point.y) >
                2 / store.getState().board.view.stageScale.x
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
    const stageScale = store.getState().board.view.stageScale.x

    // Finalize & Create stroke from LiveStroke
    const pagePosition = e.target.getPosition()
    const stroke = liveStroke.finalize(stageScale, pagePosition)

    switch (stroke.type) {
        case ToolType.Eraser: {
            const { erasedStrokes } = store.getState().drawing
            const s = Object.keys(erasedStrokes).map((id) => erasedStrokes[id])
            if (s.length > 0) {
                handleDeleteStrokes(...s)
            }
            break
        }
        case ToolType.Select: {
            const { strokes } =
                store.getState().board.pageCollection[stroke.pageId]
            const selectedStrokes = matchStrokeCollision(
                strokes,
                getSelectionPolygon(stroke.points)
            )

            store.dispatch(
                MOVE_SHAPES_TO_DRAG_LAYER({
                    strokes: Object.values(selectedStrokes),
                    pagePosition,
                })
            )
            break
        }
        default:
            handleAddStrokes(stroke)
    }

    // notify the livestroke renderer
    store.dispatch(END_LIVESTROKE())

    if (tid !== 0) {
        handleSetTool({ type: ToolType.Pen })
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
    if (store.getState().drawing.isMouseDown) {
        store.dispatch(SET_ISMOUSEDOWN(false))
    }
}

export function getPageIndex(pageId: string): number {
    return store.getState().board.pageRank.indexOf(pageId)
}

export function getPageMeta(pageId: string): PageMeta {
    return store.getState().board.pageCollection[pageId].meta
}

// helper function to get current livestroke
function getLiveStroke() {
    return store.getState().drawing.liveStroke
}

function moveEraser(liveStroke: LiveStroke, pagePosition: Point): void {
    const { strokes } = store.getState().board.pageCollection[liveStroke.pageId]
    const selectedStrokes = liveStroke.selectLineCollision(
        strokes,
        pagePosition
    )
    if (Object.keys(selectedStrokes).length > 0) {
        store.dispatch(SET_ERASED_STROKES(selectedStrokes))
    }
}
