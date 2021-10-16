import { KonvaEventObject } from "konva/types/Node"
import store from "redux/store"
import { PageMeta } from "redux/board/board.types"
import { handleAddStroke, handleDeleteStrokes } from "./handlers"
import { getSelectedShapes } from "./hitbox"
import { Point, ToolType } from "../drawing.types"
import { finaliseStroke } from "./finalise"

let tid: number | NodeJS.Timeout = 0

export function startLiveStroke(point: Point, pageId: string): void {
    store.dispatch({ type: "START_LIVESTROKE", payload: { point, pageId } })

    // set Line type when mouse hasnt moved for 1 sec
    const liveStroke = getLiveStroke()
    if (liveStroke.type === ToolType.Pen) {
        tid = setTimeout(() => {
            store.dispatch({ type: "SET_TYPE", payload: ToolType.Line })
        }, 1000)
    }
}

/**
 * Update the live stroke when position is moved in the canvas
 * @param {*} point
 */
export function moveLiveStroke(point: Point, pagePosition: Point): void {
    const stageScale = store.getState().board.view.stageScale.x
    const liveStroke = getLiveStroke()
    const { strokes } = store.getState().board.pageCollection[liveStroke.pageId]
    store.dispatch({
        type: "UPDATE_LIVESTROKE",
        payload: { point, stageScale, strokes, pagePosition },
    })

    // check if mouse is stationary, else disable switchToLine
    if (tid !== 0 && liveStroke.type === ToolType.Pen) {
        const { pointsSegments } = getLiveStroke()
        if (
            Math.abs((pointsSegments ?? [])[0][0] - point.x) > 2 / stageScale ||
            Math.abs((pointsSegments ?? [])[0][1] - point.y) > 2 / stageScale
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
    const stageScale = store.getState().board.view.stageScale.x

    // Finalize & Create stroke from LiveStroke
    const pagePosition = e.target.getPosition()
    const stroke = finaliseStroke(stageScale, pagePosition)

    switch (stroke.type) {
        case ToolType.Eraser: {
            const { erasedStrokes } = store.getState().drawing
            const strokes = Object.keys(erasedStrokes).map(
                (id) => erasedStrokes[id]
            )
            if (strokes.length > 0) {
                handleDeleteStrokes(strokes)
            }
            break
        }
        case ToolType.Select: {
            const { strokes } =
                store.getState().board.pageCollection[stroke.pageId]
            const shapes = getSelectedShapes(stroke, strokes, e)

            store.dispatch({
                type: "SET_TR_NODES",
                payload: shapes,
            })
            break
        }
        default:
            handleAddStroke(stroke)
    }

    if (tid !== 0) {
        store.dispatch({
            type: "SET_TYPE",
            payload: ToolType.Pen,
        })
        clearTimeout(tid as number)
        tid = 0
    }

    store.dispatch({
        type: "END_LIVESTROKE",
        payload: undefined,
    })
}

export function abortLiveStroke(): void {
    if (tid !== 0) {
        clearTimeout(tid as number)
        tid = 0
    }
    const liveStroke = getLiveStroke()
    if (liveStroke.pointsSegments?.length) {
        store.dispatch({
            type: "END_LIVESTROKE",
            payload: undefined,
        })
    }
    if (store.getState().drawing.isMouseDown) {
        store.dispatch({
            type: "SET_ISMOUSEDOWN",
            payload: false,
        })
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
