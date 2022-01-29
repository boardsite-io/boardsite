import { DEFAULT_PAGE_GAP } from "consts"
import { BoardState, StageAttrs } from "redux/board/index.types"
import {
    getPageHeight,
    getViewCenterY,
    onFirstPage,
    onLastPage,
} from "./helpers"

export enum DetectionResult {
    Previous,
    Unchanged,
    Next,
}

export const detectPageChange = (
    boardState: BoardState,
    stageAttrs: StageAttrs
): DetectionResult => {
    const currPageHeight = getPageHeight(boardState, 0)
    const centerY = getViewCenterY(stageAttrs)

    if (!currPageHeight) {
        return DetectionResult.Unchanged
    }

    const HALF_GAP = DEFAULT_PAGE_GAP / 2
    const prevPageBorder = -HALF_GAP
    const nextPageBorder = currPageHeight + HALF_GAP

    if (centerY < prevPageBorder) {
        if (!onFirstPage(boardState)) {
            return DetectionResult.Previous
        }
    } else if (centerY > nextPageBorder) {
        if (!onLastPage(boardState)) {
            return DetectionResult.Next
        }
    }

    return DetectionResult.Unchanged
}

export const toPreviousPage = (
    boardState: BoardState,
    stageAttrs: StageAttrs
) => {
    const prevPageHeight = getPageHeight(boardState, -1)

    if (prevPageHeight) {
        stageAttrs.y -= (prevPageHeight + DEFAULT_PAGE_GAP) * stageAttrs.scaleY
    }
}

export const toNextPage = (boardState: BoardState, stageAttrs: StageAttrs) => {
    const currPageHeight = getPageHeight(boardState, 0)

    if (currPageHeight) {
        stageAttrs.y += (currPageHeight + DEFAULT_PAGE_GAP) * stageAttrs.scaleY
    }
}
