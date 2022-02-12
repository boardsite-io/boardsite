import { DEFAULT_PAGE_GAP } from "consts"
import { TransformState } from "state/view/ViewState/index.types"
import { getPageSize, getViewCenterY, onFirstPage, onLastPage } from "./helpers"

export enum DetectionResult {
    Previous,
    Unchanged,
    Next,
}

export const detectPageChange = (
    viewTransform: TransformState
): DetectionResult => {
    const transformedCenterY = getViewCenterY(viewTransform)
    const prevPageBorder = -DEFAULT_PAGE_GAP / 2
    const nextPageBorder =
        getPageSize(0).height * viewTransform.scale + DEFAULT_PAGE_GAP / 2

    if (transformedCenterY < prevPageBorder) {
        if (!onFirstPage()) {
            return DetectionResult.Previous
        }
    } else if (transformedCenterY > nextPageBorder) {
        if (!onLastPage()) {
            return DetectionResult.Next
        }
    }

    return DetectionResult.Unchanged
}

export const toPreviousPage = (
    viewTransform: TransformState
): TransformState => {
    const prevPageHeight = getPageSize(-1).height

    if (prevPageHeight) {
        return {
            ...viewTransform,
            yOffset:
                viewTransform.yOffset - (prevPageHeight + DEFAULT_PAGE_GAP),
        }
    }
    return viewTransform
}

export const toNextPage = (viewTransform: TransformState): TransformState => {
    const currPageHeight = getPageSize().height

    if (currPageHeight) {
        return {
            ...viewTransform,
            yOffset:
                viewTransform.yOffset + (currPageHeight + DEFAULT_PAGE_GAP),
        }
    }
    return viewTransform
}
