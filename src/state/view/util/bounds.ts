import {
    SCROLL_LIMIT_FIRST_PAGE,
    SCROLL_LIMIT_HORIZONTAL,
    SCROLL_LIMIT_LAST_PAGE,
} from "consts"
import { ViewState, ViewTransform } from "state/view/state/index.types"

type GetHorizontalBoundsProps = {
    newTransform: ViewTransform
    pageWidth: number
    keepCentered: boolean
} & Pick<ViewState, "innerWidth">

export const getHorizontalBounds = ({
    newTransform,
    pageWidth,
    keepCentered,
    innerWidth,
}: GetHorizontalBoundsProps) => {
    const limit = keepCentered ? 1 : SCROLL_LIMIT_HORIZONTAL
    const offset = (innerWidth * limit) / newTransform.scale - pageWidth / 2
    return {
        leftBound: offset,
        rightBound: innerWidth / newTransform.scale - offset,
    }
}

type GetUpperBoundProps = {
    newTransform: ViewTransform
} & Pick<ViewState, "innerHeight">

export const getUpperBound = ({
    newTransform,
    innerHeight,
}: GetUpperBoundProps): number => {
    return (innerHeight * SCROLL_LIMIT_FIRST_PAGE) / newTransform.scale
}

type GetLowerBoundProps = {
    newTransform: ViewTransform
    pageHeight: number
} & Pick<ViewState, "innerHeight">

export const getLowerBound = ({
    newTransform,
    pageHeight,
    innerHeight,
}: GetLowerBoundProps): number => {
    return (
        (innerHeight * SCROLL_LIMIT_LAST_PAGE) / newTransform.scale - pageHeight
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
