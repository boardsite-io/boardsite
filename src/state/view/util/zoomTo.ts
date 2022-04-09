import { ZOOM_SCALE_MAX, ZOOM_SCALE_MIN } from "consts"
import { Point } from "drawing/stroke/index.types"
import { ViewTransform } from "state/view/state/index.types"
import { applyBound } from "./bounds"

interface ZoomToProps {
    viewTransform: ViewTransform
    zoomPoint: Point
    zoomScale: number
}

export const zoomTo = ({
    viewTransform,
    zoomPoint,
    zoomScale,
}: ZoomToProps): ViewTransform => {
    const scale1 = viewTransform.scale
    const scale2 = applyBound({
        value: zoomScale * scale1,
        min: ZOOM_SCALE_MIN,
        max: ZOOM_SCALE_MAX,
    })

    return {
        xOffset:
            viewTransform.xOffset + zoomPoint.x / scale2 - zoomPoint.x / scale1,
        yOffset:
            viewTransform.yOffset + zoomPoint.y / scale2 - zoomPoint.y / scale1,
        scale: scale2,
    }
}
