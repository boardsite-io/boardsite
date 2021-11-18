import React, { useEffect } from "react"
import { ReactReduxContext } from "react-redux"
import { Stage } from "react-konva"
import { ToolType } from "drawing/stroke/types"
import {
    RESIZE_DEBOUNCE,
    ZOOM_IN_WHEEL_SCALE,
    ZOOM_OUT_WHEEL_SCALE,
} from "consts"
import {
    CENTER_VIEW,
    ON_WINDOW_RESIZE,
    SET_STAGE_X,
    SET_STAGE_Y,
    SCROLL_STAGE_Y,
    ZOOM_TO,
    MULTI_TOUCH_MOVE,
    MULTI_TOUCH_END,
} from "redux/board/board"
import store from "redux/store"
import { useCustomSelector } from "redux/hooks"
import { debounce } from "lodash"
import { KonvaEventObject } from "konva/lib/Node"
import { Vector2d } from "konva/lib/types"
import Content from "./content"

const BoardStage: React.FC = () => {
    const isPanMode = useCustomSelector(
        (state) => state.drawing.tool.type === ToolType.Pan
    )
    const {
        stageWidth,
        stageHeight,
        stageX,
        stageY,
        stageScale,
        keepCentered,
    } = useCustomSelector((state) => state.board.view)

    const resize = () => {
        store.dispatch(ON_WINDOW_RESIZE())
        store.dispatch(CENTER_VIEW())
    }
    const onResize = debounce(resize, RESIZE_DEBOUNCE)

    useEffect(() => window.addEventListener("resize", onResize), [])

    /**
     * Wheel event handler function
     * @param {event} e
     */
    const onWheel = (e: KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault()
        if (isPanMode || e.evt.ctrlKey) {
            let zoomScale
            if (e.evt.deltaY < 0) {
                zoomScale = ZOOM_IN_WHEEL_SCALE
            } else {
                zoomScale = ZOOM_OUT_WHEEL_SCALE
            }
            store.dispatch(
                ZOOM_TO({
                    zoomPoint: e.target.getStage()?.getPointerPosition(),
                    zoomScale,
                })
            )
        } else {
            store.dispatch(SCROLL_STAGE_Y(e.evt.deltaY))
        }
    }

    /**
     * Handles updating the states after stage drag events
     * @param {event} e
     */
    const onDragEnd = (e: KonvaEventObject<DragEvent>) => {
        if (e.target.attrs.className === "stage") {
            store.dispatch(SET_STAGE_X(e.target.attrs.x))
            store.dispatch(SET_STAGE_Y(e.target.attrs.y))
        }
    }

    /**
     *
     * @param {object} pos current position of drag event on stage, e.g. {x: 12, y: 34}
     */
    const dragBound = (pos: Vector2d) => {
        if (keepCentered) {
            const x = stageWidth / 2
            if (x >= 0) {
                return { x, y: pos.y }
            }
        }

        return pos
    }

    const handleTouchMove = (e: KonvaEventObject<TouchEvent>) => {
        e.evt.preventDefault()
        const touch1 = e.evt.touches[0]
        const touch2 = e.evt.touches[1]

        if (touch1 && touch2) {
            const p1 = {
                x: touch1.clientX,
                y: touch1.clientY,
            }
            const p2 = {
                x: touch2.clientX,
                y: touch2.clientY,
            }
            store.dispatch(MULTI_TOUCH_MOVE({ p1, p2 }))
        }
    }

    const handleTouchEnd = () => {
        store.dispatch(MULTI_TOUCH_END())
    }

    return (
        <div className="wrap">
            <ReactReduxContext.Consumer>
                {(value) => (
                    <Stage
                        shadowForStrokeEnabled={false}
                        perfectDrawEnabled={false}
                        preventDefault
                        draggable={isPanMode}
                        dragBoundFunc={dragBound}
                        className="stage"
                        width={stageWidth}
                        height={stageHeight}
                        scale={stageScale}
                        x={stageX}
                        y={stageY}
                        // onDragStart={onDragStart}
                        // onDragMove={onDragMove}
                        onDragEnd={onDragEnd}
                        onContextMenu={(e) => e.evt.preventDefault()}
                        onTouchMove={isPanMode ? undefined : handleTouchMove}
                        onTouchEnd={isPanMode ? undefined : handleTouchEnd}
                        onWheel={onWheel}>
                        <ReactReduxContext.Provider value={value}>
                            <Content value={value} />
                        </ReactReduxContext.Provider>
                    </Stage>
                )}
            </ReactReduxContext.Consumer>
        </div>
    )
}
export default BoardStage
