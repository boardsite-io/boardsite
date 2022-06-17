import { Point } from "bezier-js"
import { LiveStroke } from "drawing/livestroke/index.types"
import { ToolType } from "drawing/stroke/index.types"
import { MouseEvent, TouchEvent } from "react"
import { settings } from "state/settings"
import { ViewTransform } from "state/view/state/index.types"
import { PageOffset } from "View/Board/RenderNG/Page/index.types"
import { draw } from "util/render/shapes"

export const drawLiveStroke = (
    liveStroke: LiveStroke,
    canvasRef: React.RefObject<HTMLCanvasElement>
) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    draw(ctx, liveStroke)
}

interface GetTouchPositionProps {
    event: TouchEvent<HTMLElement>
    pageOffset: PageOffset
    transform: ViewTransform
}

export const getTouchPosition = ({
    event,
    pageOffset,
    transform,
}: GetTouchPositionProps): Point => {
    const touch = event.touches[0] || event.changedTouches[0]

    const point = {
        x: touch.pageX,
        y: touch.pageY,
    }
    return applyTransformTo({ point, pageOffset, transform })
}

interface GetMousePositionProps {
    event: MouseEvent<HTMLElement>
    pageOffset: PageOffset
    transform: ViewTransform
}

export const getMousePosition = ({
    event,
    pageOffset,
    transform,
}: GetMousePositionProps): Point => {
    const point = {
        x: event.pageX,
        y: event.pageY,
    }
    return applyTransformTo({ point, pageOffset, transform })
}

interface ApplyTransformToProps {
    point: Point
    pageOffset: PageOffset
    transform: ViewTransform
}

const applyTransformTo = ({
    point,
    pageOffset,
    transform,
}: ApplyTransformToProps): Point => ({
    x: point.x / transform.scale - transform.xOffset - pageOffset.left,
    y: point.y / transform.scale - transform.yOffset - pageOffset.top,
})

export const isDrawType = (type: ToolType): boolean =>
    type === ToolType.Pen ||
    type === ToolType.Highlighter ||
    type === ToolType.Line ||
    type === ToolType.Rectangle ||
    type === ToolType.Circle

export const isValidClick = (e: MouseEvent<HTMLElement>): boolean => {
    const isValid =
        e.buttons !== 2 && // right mouse
        e.buttons !== 3 // left+right mouse

    return isValid
}

export const isValidTouch = (e: TouchEvent<HTMLElement>): boolean => {
    const touch1 = e.touches[0] as Touch & { touchType?: string }
    const touch2 = e.touches[1] as Touch & { touchType?: string }
    const { directDraw } = settings.getState()

    // exit if draw with finger is not set
    if (!directDraw && touch1.touchType === "direct") {
        return false
    }

    // double finger => invalid
    return !(touch1 && touch2)
}
