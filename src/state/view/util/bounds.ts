import {
    SCROLL_LIMIT_FIRST_PAGE,
    SCROLL_LIMIT_HORIZONTAL,
    SCROLL_LIMIT_LAST_PAGE,
} from "consts"
import { ViewTransform } from "state/view/state/index.types"

interface GetHorizontalBoundsProps {
    newTransform: ViewTransform
    pageWidth: number
    keepCentered: boolean
}

export const getHorizontalBounds = ({
    newTransform,
    pageWidth,
    keepCentered,
}: GetHorizontalBoundsProps) => {
    const limit = keepCentered ? 1 : SCROLL_LIMIT_HORIZONTAL
    const offset =
        (window.innerWidth * limit) / newTransform.scale - pageWidth / 2
    return {
        leftBound: offset,
        rightBound: window.innerWidth / newTransform.scale - offset,
    }
}

export const getUpperBound = (newTransform: ViewTransform): number => {
    return (window.innerHeight * SCROLL_LIMIT_FIRST_PAGE) / newTransform.scale
}

export const getLowerBound = (
    newTransform: ViewTransform,
    pageHeight: number
): number => {
    return (
        (window.innerHeight * SCROLL_LIMIT_LAST_PAGE) / newTransform.scale -
        pageHeight
    )
}

interface ApplyBoundProps {
    value: number
    min: number
    max: number
}

export const applyBound = ({ value, min, max }: ApplyBoundProps): number => {
    if (value > max) return max
    if (value < min) return min
    return value
}
