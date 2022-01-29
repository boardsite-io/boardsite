import { Point } from "drawing/stroke/index.types"
import {
    DEFAULT_STAGE_Y,
    ZOOM_IN_WHEEL_SCALE,
    ZOOM_OUT_WHEEL_SCALE,
    ZOOM_SCALE_MAX,
    ZOOM_SCALE_MIN,
} from "consts"
import { BoardState, StageAttrs } from "redux/board/index.types"
import { getCenterX, getCenterY, getCurrentPageWidth } from "./helpers"
import { applyBoundsX, applyBoundsY } from "./bounds"

interface ZoomToProps {
    stageAttrs: StageAttrs
    zoomPoint: Point
    zoomScale: number
}

export const zoomTo = ({
    stageAttrs,
    zoomPoint,
    zoomScale,
}: ZoomToProps): StageAttrs => {
    const mousePointTo = {
        x: (zoomPoint.x - stageAttrs.x) / stageAttrs.scaleX,
        y: (zoomPoint.y - stageAttrs.y) / stageAttrs.scaleY,
    }

    // Calculate new stage scale and apply bounds if necessary
    let newScale = zoomScale * stageAttrs.scaleX

    if (newScale > ZOOM_SCALE_MAX) {
        newScale = ZOOM_SCALE_MAX
    } else if (newScale < ZOOM_SCALE_MIN) {
        newScale = ZOOM_SCALE_MIN
    }

    return {
        ...stageAttrs,
        x: zoomPoint.x - mousePointTo.x * newScale,
        y: zoomPoint.y - mousePointTo.y * newScale,
        scaleX: newScale,
        scaleY: newScale,
    }
}

export const zoomCenter = (
    boardState: BoardState,
    isZoomingIn: boolean
): void => {
    const centerOfScreen = {
        x: getCenterX(),
        y: getCenterY(),
    }
    boardState.stage.attrs = zoomTo({
        stageAttrs: boardState.stage.attrs,
        zoomPoint: centerOfScreen,
        zoomScale: isZoomingIn ? ZOOM_IN_WHEEL_SCALE : ZOOM_OUT_WHEEL_SCALE,
    })

    // Apply bounds
    boardState.stage.attrs = {
        ...boardState.stage.attrs,
        x: applyBoundsX({
            boardState,
            stageAttrs: boardState.stage.attrs,
            xCandidate: boardState.stage.attrs.x,
        }),
        y: applyBoundsY({
            boardState,
            stageAttrs: boardState.stage.attrs,
            yCandidate: boardState.stage.attrs.y,
        }),
    }
}

export const initialView = (state: BoardState): void => {
    state.stage.attrs = {
        ...state.stage.attrs,
        scaleX: 1,
        scaleY: 1,
        x: getCenterX(),
        y: DEFAULT_STAGE_Y,
    }
    state.triggerStageRender?.()
}

interface GetScaledYProps {
    y: number
    oldScale: number
    newScale: number
}

const getScaledY = ({ y, oldScale, newScale }: GetScaledYProps): number =>
    window.innerHeight / 2 -
    ((window.innerHeight / 2 - y) / oldScale) * newScale

export const resetView = (state: BoardState): void => {
    const oldScale = state.stage.attrs.scaleX
    const newScale = 1

    state.stage.attrs = {
        ...state.stage.attrs,
        scaleX: newScale,
        scaleY: newScale,
        x: getCenterX(),
        y: getScaledY({
            y: state.stage.attrs.y,
            oldScale,
            newScale,
        }),
    }
    state.triggerStageRender?.()
}

export const centerView = (state: BoardState): void => {
    const pageWidth = getCurrentPageWidth(state)

    if (window.innerWidth >= pageWidth * state.stage.attrs.scaleX) {
        state.stage.attrs.x = getCenterX()
    } else {
        fitToPage(state)
    }
}

export const fitToPage = (state: BoardState): void => {
    const oldScale = state.stage.attrs.scaleX
    const newScale = window.innerWidth / getCurrentPageWidth(state)

    state.stage.attrs = {
        ...state.stage.attrs,
        scaleX: newScale,
        scaleY: newScale,
        x: getCenterX(),
        y: getScaledY({
            y: state.stage.attrs.y,
            oldScale,
            newScale,
        }),
    }
}
