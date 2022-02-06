import { pageSize } from "consts"
import { Point } from "drawing/stroke/index.types"
import { PageSize } from "redux/board/index.types"
import { TransformState } from "state/view/ViewState/index.types"
import { MainMenuState } from "redux/menu/index.types"
import { DialogState } from "redux/session/index.types"
import store from "redux/store"
import { viewState } from "state/view"

export const getCenterOfScreen = () => ({
    x: getCenterX(),
    y: getCenterY(),
})

export const getCenterX = (): number => window.innerWidth / 2

export const getCenterY = (): number => window.innerHeight / 2

export const getViewCenterX = (viewTransform: TransformState): number =>
    applyTransform1D(getCenterX(), viewTransform.scale, viewTransform.xOffset)

export const getViewCenterY = (viewTransform: TransformState): number =>
    applyTransform1D(getCenterY(), viewTransform.scale, viewTransform.yOffset)

export const applyTransform1D = (x: number, scale: number, offset: number) =>
    x - scale * offset

export const applyTransformToPoint = (
    point: Point,
    transform: TransformState
): Point => ({
    x: applyTransform1D(point.x, transform.scale, transform.xOffset),
    y: applyTransform1D(point.y, transform.scale, transform.yOffset),
})

export const getPageSize = (indexOffset = 0): PageSize => {
    const { pageRank, currentPageIndex, pageCollection } =
        store.getState().board
    const pageId = pageRank[currentPageIndex + indexOffset]

    return pageCollection[pageId]?.meta?.size ?? pageSize.a4landscape
}

export const onFirstPage = (): boolean =>
    store.getState().board.currentPageIndex === 0

export const onLastPage = (): boolean =>
    store.getState().board.currentPageIndex ===
    store.getState().board.pageRank.length - 1

export const isMenuOpen = () =>
    store.getState().menu.mainMenuState !== MainMenuState.Closed ||
    store.getState().menu.shortcutsOpen ||
    store.getState().session.dialogState !== DialogState.Closed

export const isFullScreen = () => {
    const effectivePageWidth =
        getPageSize().width * viewState.getTransformState().scale
    return effectivePageWidth > window.innerWidth
}

export const newOffsetY = (newScale: number, yFixed: number): number => {
    const { scale, yOffset } = viewState.getTransformState()

    return yOffset + yFixed / newScale - yFixed / scale
}
