import { KonvaEventObject } from "konva/types/Node"
import store from "../redux/store"
import {
    START_LIVESTROKE,
    UPDATE_LIVESTROKE,
    END_LIVESTROKE,
    SET_TYPE,
} from "../redux/slice/drawcontrol"
import { handleAddStroke } from "./handlers"
import { Point, Stroke, ToolType, TrRefType } from "../types"
import { BoardStroke } from "../component/board/stroke/stroke"

let tid: number | NodeJS.Timeout = 0

/**
 * Start the current stroke when mouse is pressed down
 * @param {*} point
 */
export function startLiveStroke(point: Point): void {
    store.dispatch(START_LIVESTROKE([point.x, point.y]))
    // set Line type when mouse hasnt moved for 1 sec
    if (getLiveStroke().type === ToolType.Pen) {
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
    store.dispatch(
        UPDATE_LIVESTROKE({
            point,
            scale: store.getState().viewControl.stageScale.x,
        })
    )
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
    pageId: string,
    trRef: TrRefType,
    e: KonvaEventObject<MouseEvent>
): Promise<void> {
    const liveStroke = getLiveStroke()
    const stroke = new BoardStroke((liveStroke as unknown) as Stroke, pageId)
    // clear livestroke
    store.dispatch(END_LIVESTROKE())

    if (stroke.onRegister(trRef, e)) {
        handleAddStroke(stroke)
    }

    if (tid !== 0) {
        store.dispatch(SET_TYPE(ToolType.Pen))
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
