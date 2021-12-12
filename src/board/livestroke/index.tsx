import React, { memo, useState } from "react"
import { Rect } from "react-konva"
import { BoardLiveStroke } from "drawing/livestroke"
import { LiveStrokeShape } from "board/livestroke/livestroke"
import store from "redux/store"
import { Stage } from "konva/lib/Stage"
import { KonvaEventObject } from "konva/lib/Node"
import { Vector2d } from "konva/lib/types"
import { Stroke, ToolType } from "drawing/stroke/index.types"
import { useCustomSelector } from "hooks"
import { PageProps } from "board/page/index.types"

let isMouseDown = false

const LiveStroke = memo<PageProps>(({ layerRef, pageId, pageInfo }) => {
    const [liveStrokeTrigger, setLiveStrokeTrigger] = useState(0)
    const [liveStroke] = useState(new BoardLiveStroke())
    const isPanMode = useCustomSelector(
        (state) => state.drawing.tool.type === ToolType.Pan
    )

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

        const { type } = store.getState().drawing.tool
        if (type === ToolType.Eraser || type === ToolType.Select) {
            layerRef?.current?.clearCache()
        }

        isMouseDown = true
        const pos = getPointerPositionInStage(e)

        liveStroke.setTool(store.getState().drawing.tool).start(pos, pageId)
        setLiveStrokeTrigger(0)
    }

    const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        if (
            !isMouseDown ||
            e.evt.buttons === 2 || // right mouse
            e.evt.buttons === 3 // left+right mouse
        ) {
            if (!liveStroke.isReset()) {
                // cancel stroke when right / left+right mouse is clicked
                liveStroke.reset()
                setLiveStrokeTrigger((prev) => prev + 1)
            }
            isMouseDown = false
            return
        }

        const pos = getPointerPositionInStage(e)
        liveStroke.move(pos, e.target.getPosition())
        setLiveStrokeTrigger((prev) => prev + 1)
    }

    const onMouseUp = (e: KonvaEventObject<MouseEvent>) => {
        if (!isMouseDown) {
            return
        } // Ignore reentering

        // update last position
        const pos = getPointerPositionInStage(e)
        liveStroke.move(pos, e.target.getPosition())

        // register finished stroke
        const stroke = liveStroke.finalize(e.target.getPosition()) as Stroke
        isMouseDown = false
        setLiveStrokeTrigger((prev) => prev + 1)

        BoardLiveStroke.register(stroke, e.target.getPosition())
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
            liveStroke.reset()
            setLiveStrokeTrigger?.((prev) => prev + 1)
            isMouseDown = false
        }
    }

    const onTouchEnd = (e: KonvaEventObject<TouchEvent>) => {
        onMouseUp(e as unknown as KonvaEventObject<MouseEvent>)
    }

    const isValidTouch = (e: KonvaEventObject<TouchEvent>) => {
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

    return (
        <>
            <Rect
                listening={!isPanMode}
                draggable={false}
                onMouseDown={onMouseDown}
                onMousemove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                {...pageInfo}
            />
            <LiveStrokeShape
                liveStroke={liveStroke}
                liveStrokeTrigger={liveStrokeTrigger}
            />
        </>
    )
})

export default LiveStroke
