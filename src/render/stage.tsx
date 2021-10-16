import React, { useEffect } from "react"
import { ReactReduxContext } from "react-redux"
import { Stage } from "react-konva"
import { Vector2d } from "konva/types/types"
import { KonvaEventObject } from "konva/types/Node"
import { ToolType } from "redux/drawing/drawing.types"
import { ZOOM_IN_WHEEL_SCALE, ZOOM_OUT_WHEEL_SCALE } from "consts"
import store from "redux/store"
import { useCustomSelector } from "redux/hooks"
import Content from "./content"

const BoardStage: React.FC = () => {
    const isPanMode = useCustomSelector(
        (state) => state.drawing.liveStroke.type === ToolType.Pan
    )
    const {
        stageWidth,
        stageHeight,
        stageX,
        stageY,
        stageScale,
        keepCentered,
    } = useCustomSelector((state) => state.board.view)

    useEffect(() => {
        // listen for resize to update stage dimensions
        window.addEventListener("resize", () =>
            store.dispatch({
                type: "ON_WINDOW_RESIZE",
                payload: undefined,
            })
        )
        // center initial view
        store.dispatch({
            type: "CENTER_VIEW",
            payload: undefined,
        })
    }, [])

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
            store.dispatch({
                type: "ZOOM_TO",
                payload: {
                    zoomPoint: e.target.getStage()?.getPointerPosition(),
                    zoomScale,
                },
            })
        } else {
            store.dispatch({
                type: "SCROLL_STAGE_Y",
                payload: e.evt.deltaY,
            })
        }
    }

    /**
     * Handles updating the states after stage drag events
     * @param {event} e
     */
    const onDragEnd = (e: KonvaEventObject<DragEvent>) => {
        if (e.target.attrs.className === "stage") {
            store.dispatch({
                type: "SET_STAGE_X",
                payload: e.target.attrs.x,
            })
            store.dispatch({
                type: "SET_STAGE_Y",
                payload: e.target.attrs.y,
            })
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
            store.dispatch({
                type: "MULTI_TOUCH_MOVE",
                payload: { p1, p2 },
            })
        }
    }

    const handleTouchEnd = () => {
        store.dispatch({
            type: "MULTI_TOUCH_END",
            payload: undefined,
        })
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
