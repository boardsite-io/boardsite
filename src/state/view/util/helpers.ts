import { Point } from "drawing/stroke/index.types"
import { ViewState, ViewTransform } from "state/view/state/index.types"

type GetViewCenterXProps = {
    viewTransform: ViewTransform
} & Pick<ViewState, "innerWidth">

export const getViewCenterX = ({
    viewTransform,
    innerWidth,
}: GetViewCenterXProps): number =>
    applyTransform1D(innerWidth / 2, viewTransform.scale, viewTransform.xOffset)

type GetViewCenterYProps = {
    viewTransform: ViewTransform
} & Pick<ViewState, "innerHeight">

export const getViewCenterY = ({
    viewTransform,
    innerHeight,
}: GetViewCenterYProps): number =>
    applyTransform1D(
        innerHeight / 2,
        viewTransform.scale,
        viewTransform.yOffset
    )

export const applyTransform1D = (x: number, scale: number, offset: number) =>
    x - scale * offset

export const applyTransformToPoint = (
    point: Point,
    transform: ViewTransform
): Point => ({
    x: applyTransform1D(point.x, transform.scale, transform.xOffset),
    y: applyTransform1D(point.y, transform.scale, transform.yOffset),
})
