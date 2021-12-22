import { Point } from "drawing/stroke/index.types"
import {
    DEFAULT_STAGE_Y,
    ZOOM_IN_WHEEL_SCALE,
    ZOOM_OUT_WHEEL_SCALE,
    ZOOM_SCALE_MAX,
    ZOOM_SCALE_MIN,
} from "consts"
import { BoardState, StageAttrs } from "redux/board/board.types"
import { getCenterX, getCenterY, getCurrentPageWidth } from "./helpers"
import { applyBoundsX, applyBoundsY } from "./bounds"

interface ZoomToProps {
    boardState: BoardState
    stageAttrs: StageAttrs
    zoomPoint: Point
    zoomScale: number
}

export const zoomTo = ({
    boardState,
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

    // if zoomed out then center, else zoom to mouse coords
    const shouldCenter =
        boardState.stage.keepCentered &&
        window.innerWidth > getCurrentPageWidth(boardState) * newScale

    return {
        ...stageAttrs,
        x: applyBoundsX({
            boardState,
            stageAttrs,
            xCandidate: shouldCenter
                ? getCenterX()
                : zoomPoint.x - mousePointTo.x * newScale,
        }),
        y: applyBoundsY({
            boardState,
            stageAttrs,
            yCandidate: zoomPoint.y - mousePointTo.y * newScale,
        }),
        scaleX: newScale,
        scaleY: newScale,
    }
}

export const zoomCenter = (state: BoardState, isZoomingIn: boolean): void => {
    const centerOfScreen = {
        x: getCenterX(),
        y: getCenterY(),
    }
    state.stage.attrs = zoomTo({
        boardState: state,
        stageAttrs: state.stage.attrs,
        zoomPoint: centerOfScreen,
        zoomScale: isZoomingIn ? ZOOM_IN_WHEEL_SCALE : ZOOM_OUT_WHEEL_SCALE,
    })
}

export const initialView = (state: BoardState): void => {
    state.stage.attrs = {
        ...state.stage.attrs,
        scaleX: 1,
        scaleY: 1,
        x: getCenterX(),
        y: DEFAULT_STAGE_Y,
    }
    state.stage.renderTrigger = !state.stage.renderTrigger
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
    state.stage.renderTrigger = !state.stage.renderTrigger
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
