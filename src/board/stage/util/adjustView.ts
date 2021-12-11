import { Point } from "drawing/stroke/stroke.types"
import {
    DEFAULT_STAGE_Y,
    ZOOM_IN_WHEEL_SCALE,
    ZOOM_OUT_WHEEL_SCALE,
    ZOOM_SCALE_MAX,
    ZOOM_SCALE_MIN,
} from "consts"
import { BoardState, StageAttrs } from "redux/board/board.types"
import { getCurrentPageWidth } from "./helpers"

interface ZoomToProps {
    stageAttrs: StageAttrs
    zoomPoint: Point
    zoomScale: number
    keepCentered: boolean
    pageWidth: number
}

export const zoomTo = ({
    stageAttrs,
    zoomPoint,
    zoomScale,
    keepCentered,
    pageWidth,
}: ZoomToProps): StageAttrs => {
    const mousePointTo = {
        x: (zoomPoint.x - stageAttrs.x) / stageAttrs.scaleX,
        y: (zoomPoint.y - stageAttrs.y) / stageAttrs.scaleY,
    }

    // Calculate new stage scale and apply bounds if necessary
    let newScale = zoomScale * stageAttrs.scaleX
    if (newScale > ZOOM_SCALE_MAX) newScale = ZOOM_SCALE_MAX
    if (newScale < ZOOM_SCALE_MIN) newScale = ZOOM_SCALE_MIN

    // if zoomed out then center, else zoom to mouse coords
    const newStageX = (window.innerWidth - pageWidth * newScale) / 2

    return {
        ...stageAttrs,
        x:
            keepCentered && newStageX >= 0
                ? newStageX
                : zoomPoint.x - mousePointTo.x * newScale,
        y: zoomPoint.y - mousePointTo.y * newScale,
        scaleX: newScale,
        scaleY: newScale,
    }
}

export const zoomCenter = (state: BoardState, isZoomingIn: boolean): void => {
    const centerOfScreen = {
        x: state.stage.attrs.width / 2,
        y: state.stage.attrs.height / 2,
    }
    state.stage.attrs = zoomTo({
        stageAttrs: state.stage.attrs,
        zoomPoint: centerOfScreen,
        zoomScale: isZoomingIn ? ZOOM_IN_WHEEL_SCALE : ZOOM_OUT_WHEEL_SCALE,
        keepCentered: state.stage.keepCentered,
        pageWidth:
            state.pageCollection[state.currentPageIndex]?.meta.size.width,
    })
}

export const initialView = (state: BoardState): void => {
    state.stage.attrs.scaleX = 1
    state.stage.attrs.scaleY = 1
    state.stage.attrs.y = DEFAULT_STAGE_Y
    centerView(state)
    state.stage.renderTrigger = !state.stage.renderTrigger
}

export const resetView = (state: BoardState): void => {
    const oldScale = state.stage.attrs.scaleX
    const newScale = 1
    const { height, y } = state.stage.attrs
    state.stage.attrs.scaleX = newScale
    state.stage.attrs.scaleY = newScale
    state.stage.attrs.x = 0
    state.stage.attrs.y = height / 2 - ((height / 2 - y) / oldScale) * newScale
    centerView(state as BoardState)
}

export const centerView = (state: BoardState): void => {
    const pageWidth = getCurrentPageWidth(state)
    if (!pageWidth) return

    if (state.stage.attrs.width >= pageWidth * state.stage.attrs.scaleX) {
        state.stage.attrs.x =
            (state.stage.attrs.width / 2) * state.stage.attrs.scaleX
    } else {
        fitToPage(state)
    }
}

export const fitToPage = (state: BoardState): void => {
    const oldScale = state.stage.attrs.scaleX
    const pageWidth = getCurrentPageWidth(state)
    if (!pageWidth) {
        return
    }
    const newScale = window.innerWidth / pageWidth
    state.stage.attrs.scaleX = newScale
    state.stage.attrs.scaleY = newScale
    state.stage.attrs.x = state.stage.attrs.width / 2
    state.stage.attrs.y =
        state.stage.attrs.height / 2 -
        ((state.stage.attrs.height / 2 - state.stage.attrs.y) / oldScale) *
            newScale
}
