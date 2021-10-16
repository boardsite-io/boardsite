import { RDP_EPSILON, RDP_FORCE_SECTIONS } from "consts"
import store from "redux/store"
import { LiveStroke, Point, Stroke, ToolType } from "../drawing.types"
import { simplifyRDP } from "./simplify"
import { calculateHitboxes, subPageOffset } from "./hitbox"

export const finaliseStroke = (
    stageScale: number,
    pagePosition: Point
): Stroke => {
    const liveStrokeCopy = { ...store.getState().drawing.liveStroke }
    flatPoints(liveStrokeCopy)
    processPoints(liveStrokeCopy, stageScale, pagePosition)
    return {
        ...liveStrokeCopy,
        id: createUniqueId(),
        hitboxes: calculateHitboxes(liveStrokeCopy),
    }
}

const createUniqueId = (): string =>
    Date.now().toString(36).substr(2) + Math.random().toString(36).substr(2, 10)

const flatPoints = (liveStroke: LiveStroke): void => {
    const segments = liveStroke.pointsSegments
    if (segments.length === 0) {
        liveStroke.points = []
    } else if (segments.length === 1) {
        // eslint-disable-next-line prefer-destructuring
        liveStroke.points = segments[0]
    } else {
        let pts: number[] = []
        for (let i = 0; i < segments.length - 1; i += 1) {
            pts = pts.concat(segments[i].slice(0, segments[i].length - 2))
        }
        liveStroke.points = pts.concat(segments[segments.length - 1])
    }
}

const processPoints = (
    liveStroke: LiveStroke,
    stageScale: number,
    pagePosition: Point
): void => {
    const { x: pageX, y: pageY } = pagePosition

    switch (liveStroke.type) {
        case ToolType.Pen:
            // simplify the points
            liveStroke.points = simplifyRDP(
                liveStroke.points,
                RDP_EPSILON / stageScale,
                RDP_FORCE_SECTIONS + 1
            )
            break
        case ToolType.Rectangle:
        case ToolType.Circle:
            liveStroke.x -= pageX
            liveStroke.y -= pageY
            break
        default:
            break
    }

    // compensate page offset in stage
    liveStroke.points = subPageOffset(liveStroke.points, pagePosition)
}
