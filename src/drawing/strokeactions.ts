import store from "../redux/store"
import {
    START_LIVESTROKE,
    UPDATE_LIVESTROKE,
    END_LIVESTROKE,
    SET_TYPE,
} from "../redux/slice/drawcontrol"

import { toolType } from "../constants"
import { handleAddStroke } from "./handlers"
import { LayerRefType, Point, TrRefType } from "../types"
// import { setSelectedShapes } from "./hitboxdetection"
import { BoardStroke } from "../component/board/stroke/stroke"

let tid: number | NodeJS.Timeout = 0

/**
 * Start the current stroke when mouse is pressed down
 * @param {*} point
 */
export function startLiveStroke(point: Point): void {
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
export function moveLiveStroke(point: Point): void {
    store.dispatch(
        UPDATE_LIVESTROKE({
            point,
            scale: store.getState().viewControl.stageScale.x,
        })
    )
    // check if mouse is stationary, else disable switchToLine
    if (tid !== 0 && getLiveStroke().type === toolType.PEN) {
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
    pageId: string,
    trRef: TrRefType,
    layerRef: LayerRefType
): Promise<void> {
    const liveStroke = getLiveStroke()
    if (liveStroke.type === toolType.ERASER) {
        return
    }

    const stroke = new BoardStroke(liveStroke, pageId)

    // if (liveStroke.type === toolType.SELECT) {
    //     setSelectedShapes(stroke, trRef, layerRef)
    //     store.dispatch(END_LIVESTROKE())
    //     return
    // }

    handleAddStroke(stroke)
    // clear livestroke
    store.dispatch(END_LIVESTROKE())

    if (tid !== 0) {
        store.dispatch(SET_TYPE(toolType.PEN))
        clearTimeout(tid as number)
        tid = 0
    }
}

export function getPageIndex(pageId: string): number {
    return store.getState().boardControl.pageRank.indexOf(pageId)
}

// helper function to get current livestroke
function getLiveStroke() {
    return store.getState().drawControl.liveStroke
}
