import {
    pageSize,
    SCROLL_LIMIT_FIRST_PAGE,
    SCROLL_LIMIT_HORIZONTAL,
    SCROLL_LIMIT_LAST_PAGE,
} from "consts"
import { BoardState, PageSize, StageAttrs } from "redux/board/index.types"
import { getCenterX } from "./helpers"

export const getCurrentPageSize = (boardState: BoardState): PageSize => {
    const pageId = boardState.pageRank[boardState.currentPageIndex]
    const currentPageSize = boardState.pageCollection[pageId]?.meta?.size

    return currentPageSize ?? pageSize.a4landscape
}

export const onFirstPage = (boardState: BoardState): boolean =>
    boardState.currentPageIndex === 0

export const onLastPage = (boardState: BoardState): boolean =>
    boardState.currentPageIndex === boardState.pageRank.length - 1

const getUpperBound = () => window.innerHeight * SCROLL_LIMIT_FIRST_PAGE

const getLowerBound = (boardState: BoardState, attrs: StageAttrs) =>
    window.innerHeight * SCROLL_LIMIT_LAST_PAGE -
    getCurrentPageSize(boardState).height * attrs.scaleY

interface LeftRightBounds {
    leftBound: number
    rightBound: number
}

const getLeftRightBounds = (
    boardState: BoardState,
    attrs: StageAttrs,
    useStrictBounds: boolean
): LeftRightBounds => {
    const limit = useStrictBounds ? 1 : SCROLL_LIMIT_HORIZONTAL
    const offset =
        window.innerWidth * limit -
        (getCurrentPageSize(boardState).width * attrs.scaleX) / 2

    return {
        leftBound: offset,
        rightBound: window.innerWidth - offset,
    }
}

interface ApplyBoundsXProps {
    boardState: BoardState
    stageAttrs: StageAttrs
    xCandidate: number
}

export const applyBoundsX = ({
    boardState,
    stageAttrs,
    xCandidate,
}: ApplyBoundsXProps): number => {
    const shouldCenter = boardState.stage.keepCentered

    const nonFullScreen =
        window.innerWidth >
        getCurrentPageSize(boardState).width * stageAttrs.scaleX

    let horizontalBounds

    if (shouldCenter) {
        if (nonFullScreen) {
            return getCenterX()
        }
        horizontalBounds = getLeftRightBounds(boardState, stageAttrs, true)
    } else {
        horizontalBounds = getLeftRightBounds(boardState, stageAttrs, false)
    }

    if (xCandidate > horizontalBounds.rightBound) {
        return horizontalBounds.rightBound
    }
    if (xCandidate < horizontalBounds.leftBound) {
        return horizontalBounds.leftBound
    }

    return xCandidate
}

interface ApplyBoundsYProps {
    boardState: BoardState
    stageAttrs: StageAttrs
    yCandidate: number
}

export const applyBoundsY = ({
    boardState,
    stageAttrs,
    yCandidate,
}: ApplyBoundsYProps): number => {
    if (onFirstPage(boardState)) {
        const upperBound = getUpperBound()

        if (yCandidate > upperBound) {
            return upperBound
        }

        if (onLastPage(boardState)) {
            const lowerBound = getLowerBound(boardState, stageAttrs)

            // If the upper and lower bounds cross
            // eachother then set y to upper bound
            if (upperBound < lowerBound) {
                return upperBound
            }

            if (yCandidate < lowerBound) {
                return lowerBound
            }
        }
    }

    if (onLastPage(boardState)) {
        const lowerBound = getLowerBound(boardState, stageAttrs)

        if (yCandidate < lowerBound) {
            return lowerBound
        }
    }

    return yCandidate
}
