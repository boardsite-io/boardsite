import { DEFAULT_PAGE_GAP } from "consts"
import { ViewTransform } from "state/view/state/index.types"
import { getPageSize, getViewCenterY, onFirstPage, onLastPage } from "./helpers"

export enum DetectionResult {
    Previous,
    Unchanged,
    Next,
}

export const detectPageChange = (
    viewTransform: ViewTransform
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

export const toPreviousPage = (viewTransform: ViewTransform): ViewTransform => {
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

export const toNextPage = (viewTransform: ViewTransform): ViewTransform => {
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