import { LIVESTROKE_SEGMENT_SIZE } from "consts"
import { LiveStroke } from "drawing/livestroke/index.types"
import { KonvaEventObject } from "konva/lib/Node"
import store from "redux/store"

export const isValidClick = (e: KonvaEventObject<MouseEvent>): boolean => {
    const isValid =
        e.evt.buttons !== 2 && // right mouse
        e.evt.buttons !== 3 // left+right mouse

    return isValid
}

export const isValidTouch = (e: KonvaEventObject<TouchEvent>): boolean => {
    e.evt.preventDefault()

    const touch1 = e.evt.touches?.[0] as Touch & { touchType: string }
    const touch2 = e.evt.touches?.[1] as Touch & { touchType: string }

    if (touch1?.touchType === undefined) {
        return false
    }

    if (
        // exit if draw with finger is not set
        !store.getState().drawing.directDraw &&
        touch1.touchType === "direct"
    ) {
        return false
    }

    return !(touch1 && touch2) // double finger
}

export const getSegments = (liveStroke: LiveStroke): number[][] =>
    new Array<number[]>(
        Math.ceil(liveStroke.points.length / LIVESTROKE_SEGMENT_SIZE)
    )
        .fill([])
        .map((_, i) =>
            liveStroke.points.slice(
                LIVESTROKE_SEGMENT_SIZE * i,
                LIVESTROKE_SEGMENT_SIZE * (i + 1) + 2
            )
        )
