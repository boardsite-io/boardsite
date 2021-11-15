import React from "react"
import { Rect } from "react-konva"
import { Stage } from "konva/lib/Stage"
import { ToolType } from "drawing/stroke/types"
import store from "redux/store"
import * as actions from "drawing/stroke/actions"
import { SET_ISMOUSEDOWN } from "redux/drawing/drawing"
import { useCustomSelector } from "redux/hooks"
import { DOC_SCALE } from "consts"
import { KonvaEventObject } from "konva/lib/Node"
import { Vector2d } from "konva/lib/types"
import { PageProps } from "./index.types"

const PageListener: React.FC<PageProps> = ({ pageId, pageSize }) => {
    const isMouseDown = useCustomSelector((state) => state.drawing.isMouseDown)

    const getPointerPositionInStage = (e: KonvaEventObject<MouseEvent>) => {
        const stage = e.target.getStage() as Stage
        const position = stage.getPointerPosition()
        const transform = stage.getAbsoluteTransform().copy().invert()
        return transform.point(position as Vector2d)
    }

    const onMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        if (e.evt.buttons === 2) {
            return
        }

        const { type } = store.getState().drawing.liveStroke
        if (type === ToolType.Eraser || type === ToolType.Select) {
            e.target.parent?.clearCache()
        }

        store.dispatch(SET_ISMOUSEDOWN(true))
        const pos = getPointerPositionInStage(e)
        actions.startLiveStroke(pos, pageId)
    }

    const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        if (
            !isMouseDown ||
            e.evt.buttons === 2 || // right mouse
            e.evt.buttons === 3 // left+right mouse
        ) {
            // cancel stroke when right / left+right mouse is clicked
            actions.abortLiveStroke()
            return
        }

        const pos = getPointerPositionInStage(e)
        actions.moveLiveStroke(pos, e.target.getPosition())
    }

    const onMouseUp = (e: KonvaEventObject<MouseEvent>) => {
        if (!isMouseDown) {
            return
        } // Ignore reentering

        store.dispatch(SET_ISMOUSEDOWN(false))

        // update last position
        const pos = getPointerPositionInStage(e)
        actions.moveLiveStroke(pos, e.target.getPosition())

        // register finished stroke
        actions.registerLiveStroke(e)
        e.target.parent?.cache({ pixelRatio: DOC_SCALE })
    }

    const onTouchStart = (e: KonvaEventObject<TouchEvent>) => {
        if (isValidTouch(e)) {
            onMouseDown(e as unknown as KonvaEventObject<MouseEvent>)
        }
    }

    const onTouchMove = (e: KonvaEventObject<TouchEvent>) => {
        if (isValidTouch(e)) {
            onMouseMove(e as unknown as KonvaEventObject<MouseEvent>)
        } else {
            actions.abortLiveStroke()
        }
    }

    const onTouchEnd = (e: KonvaEventObject<TouchEvent>) => {
        onMouseUp(e as unknown as KonvaEventObject<MouseEvent>)
    }

    const isValidTouch = (e: KonvaEventObject<TouchEvent>) => {
        e.evt.preventDefault()
        const touch1 = e.evt.touches[0] as Touch & { touchType: string }
        const touch2 = e.evt.touches[1] as Touch & { touchType: string }
        if (touch1.touchType === undefined) {
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

    const isPanMode = useCustomSelector(
        (state) => state.drawing.liveStroke.type === ToolType.Pan
    )

    return (
        <Rect
            {...pageSize}
            draggable={false}
            listening={!isPanMode}
            onMouseDown={onMouseDown}
            onMousemove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        />
    )
}

export default PageListener
