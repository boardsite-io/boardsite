import React, { memo, useCallback, useState } from "react"
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
import { isValidClick, isValidTouch } from "./helpers"

let isMouseDown = false

const LiveStroke = memo<PageProps>(({ layerRef, pageId, pageInfo }) => {
    const [liveStrokeTrigger, setLiveStrokeTrigger] = useState(0)
    const [liveStroke] = useState(new BoardLiveStroke())
    const isPanMode = useCustomSelector(
        (state) => state.drawing.tool.type === ToolType.Pan
    )

    const getPointerPositionInStage = useCallback(
        (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
            const stage = e.target.getStage() as Stage
            const position = stage.getPointerPosition()
            const transform = stage.getAbsoluteTransform().copy().invert()
            return transform.point(position as Vector2d)
        },
        []
    )

    // cancel stroke when right / left+right mouse
    // is clicked or when touch is invalid
    const resetLiveStroke = useCallback(() => {
        if (!liveStroke.isReset()) {
            liveStroke.reset()
            setLiveStrokeTrigger((prev) => prev + 1)
        }
        isMouseDown = false
    }, [liveStroke, setLiveStrokeTrigger])

    const onStart = useCallback(
        (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
            const { type } = store.getState().drawing.tool
            if (type === ToolType.Eraser || type === ToolType.Select) {
                layerRef?.current?.clearCache()
            }

            isMouseDown = true
            const pos = getPointerPositionInStage(e)

            liveStroke.setTool(store.getState().drawing.tool).start(pos, pageId)
            setLiveStrokeTrigger(0)
        },
        [liveStroke, isMouseDown]
    )

    const onMove = useCallback(
        (
            e: KonvaEventObject<MouseEvent | TouchEvent>,
            isSpecialClick = false
        ) => {
            if (!isMouseDown || isSpecialClick) {
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
        },
        [liveStroke, isMouseDown]
    )

    const onEnd = useCallback(
        (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
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
        },
        [liveStroke, isMouseDown]
    )

    const onMouseDown = useCallback(
        (e: KonvaEventObject<MouseEvent>) => {
            if (e.evt.buttons === 2) {
                return
            }

            onStart(e)
        },
        [liveStroke, isMouseDown]
    )

    const onTouchStart = useCallback(
        (e: KonvaEventObject<TouchEvent>) => {
            if (isValidTouch(e)) {
                onStart(e)
            }
        },
        [onStart]
    )

    const onMouseMove = useCallback(
        (e: KonvaEventObject<MouseEvent>) => {
            if (isMouseDown && isValidClick(e)) {
                onMove(e)
            } else {
                resetLiveStroke()
            }
        },
        [onMove]
    )

    const onTouchMove = useCallback(
        (e: KonvaEventObject<TouchEvent>) => {
            if (isMouseDown && isValidTouch(e)) {
                onMove(e)
            } else {
                resetLiveStroke()
            }
        },
        [liveStroke, onMove]
    )

    const onMouseUp = useCallback(
        (e: KonvaEventObject<MouseEvent>) => {
            onEnd(e)
        },
        [onEnd]
    )

    const onTouchEnd = useCallback(
        (e: KonvaEventObject<TouchEvent>) => {
            onEnd(e)
        },
        [onEnd]
    )

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
