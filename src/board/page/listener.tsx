import React, { memo } from "react"
import { Rect } from "react-konva"
import { Stage } from "konva/lib/Stage"
import { ToolType } from "drawing/stroke/types"
import store from "redux/store"
import { useCustomSelector } from "redux/hooks"
import { LAYER_CACHE_PXL } from "consts"
import { KonvaEventObject } from "konva/lib/Node"
import { Vector2d } from "konva/lib/types"
import { PageProps } from "./index.types"

const PageListener = memo<PageProps>(
    ({ pageId, pageSize, liveStroke, setLiveStrokeTrigger }) => {
        let isMouseDown = false

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
                e.target.parent?.clearCache()
            }

            isMouseDown = true
            const pos = getPointerPositionInStage(e)
            const ls = liveStroke?.()
            ls?.setTool(store.getState().drawing.tool).start(pos, pageId)
            setLiveStrokeTrigger?.(0)
        }

        const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
            if (
                !isMouseDown ||
                e.evt.buttons === 2 || // right mouse
                e.evt.buttons === 3 // left+right mouse
            ) {
                if (!liveStroke?.().isReset()) {
                    // cancel stroke when right / left+right mouse is clicked
                    liveStroke?.().reset()
                    setLiveStrokeTrigger?.((prev) => prev + 1)
                }
                return
            }

            const pos = getPointerPositionInStage(e)
            liveStroke?.().move(pos, e.target.getPosition())
            setLiveStrokeTrigger?.((prev) => prev + 1)
        }

        const onMouseUp = (e: KonvaEventObject<MouseEvent>) => {
            if (!isMouseDown) {
                return
            } // Ignore reentering

            isMouseDown = false
            // update last position
            const pos = getPointerPositionInStage(e)
            liveStroke?.().move(pos, e.target.getPosition())
            setLiveStrokeTrigger?.((prev) => prev + 1)

            // register finished stroke
            liveStroke?.()
                .register(e)
                .then(() => setLiveStrokeTrigger?.((prev) => prev + 1))

            e.target.parent?.cache({ pixelRatio: LAYER_CACHE_PXL })
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
                liveStroke?.().reset()
                setLiveStrokeTrigger?.((prev) => prev + 1)
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
            (state) => state.drawing.tool.type === ToolType.Pan
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
)

export default PageListener
