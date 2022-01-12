import React, { memo, useCallback, useEffect, useRef } from "react"
import { ReactReduxContext } from "react-redux"
import { Stage } from "react-konva"
import { Stage as StageType } from "konva/lib/Stage"
import {
    STAGE_RESIZE_DEBOUNCE,
    STAGE_UPDATE_DEBOUNCE,
    ZOOM_IN_WHEEL_SCALE,
    ZOOM_OUT_WHEEL_SCALE,
} from "consts"
import { ON_WINDOW_RESIZE, SET_STAGE_ATTRS } from "redux/board/board"
import store from "redux/store"
import { useCustomSelector } from "hooks"
import { debounce } from "lodash"
import { ToolType } from "drawing/stroke/index.types"
import { KonvaEventObject } from "konva/lib/Node"
import { StageAttrs } from "redux/board/board.types"
import { Vector2d } from "konva/lib/types"
import { zoomTo } from "./util/adjustView"
import { multiTouchEnd, multiTouchMove } from "./util/multiTouch"
import Content from "./content"
import { detectPageChange } from "./util/detectPageChange"
import { UpdateStage } from "./updateStage"
import { applyBoundsX, applyBoundsY } from "./util/bounds"

const resizeStage = debounce(
    () => store.dispatch(ON_WINDOW_RESIZE()),
    STAGE_RESIZE_DEBOUNCE
)

const updateRedux = debounce(
    (stageAttrs: StageAttrs) => store.dispatch(SET_STAGE_ATTRS(stageAttrs)),
    STAGE_UPDATE_DEBOUNCE
)

const BoardStage: React.FC = memo(() => {
    useEffect(() => window.addEventListener("resize", resizeStage), [])

    const stageRef = useRef<StageType>(null)

    const isPanMode = useCustomSelector(
        (state) => state.drawing.tool.type === ToolType.Pan
    )

    const updateStageAttrs = useCallback(
        (newAttrs: StageAttrs | null): void => {
            const stage = stageRef.current

            if (!stage) {
                return
            }

            if (newAttrs === null) {
                newAttrs = stage.getAttrs() as StageAttrs
            }

            // Copy to prevent mutating stage.getAttrs() directly
            const newAttrsCopy = { ...newAttrs }

            const boardState = store.getState().board

            // Check if page index should change
            const isDetected = detectPageChange(boardState, newAttrsCopy)

            if (!isDetected) {
                // Apply bounds before using new stage attributes
                const boundedAttrs = {
                    ...newAttrsCopy,
                    x: applyBoundsX({
                        boardState,
                        stageAttrs: newAttrsCopy,
                        xCandidate: newAttrsCopy.x,
                    }),
                    y: applyBoundsY({
                        boardState,
                        stageAttrs: newAttrsCopy,
                        yCandidate: newAttrsCopy.y,
                    }),
                }

                // Update internal state
                stage.setAttrs(boundedAttrs)

                // Synchronise the redux state with the internal state
                updateRedux(boundedAttrs)
            }
        },
        [stageRef]
    )

    /**
     * Wheel event handler function
     * @param {event} e
     */
    const onWheel = useCallback(
        (e: KonvaEventObject<WheelEvent>) => {
            e.evt.preventDefault()

            const stage = stageRef.current
            if (!stage) return

            const stageAttrs = stage.getAttrs()

            if (isPanMode || e.evt.ctrlKey) {
                const zoomPoint = stage.getPointerPosition()
                if (!zoomPoint) return

                const newAttrs = zoomTo({
                    stageAttrs,
                    zoomPoint,
                    zoomScale:
                        e.evt.deltaY < 0
                            ? ZOOM_IN_WHEEL_SCALE
                            : ZOOM_OUT_WHEEL_SCALE,
                })

                updateStageAttrs(newAttrs)
            } else {
                const newAttrs = {
                    ...stageAttrs,
                    x: stageAttrs.x - e.evt.deltaX,
                    y: stageAttrs.y - e.evt.deltaY,
                }

                updateStageAttrs(newAttrs)
            }
        },
        [stageRef, isPanMode]
    )

    const dragBoundFunc = useCallback(
        (pos: Vector2d) => {
            const stage = stageRef.current
            if (!stage) return pos

            const boardState = store.getState().board
            const stageAttrs = stage.getAttrs()

            return {
                x: applyBoundsX({
                    boardState,
                    stageAttrs,
                    xCandidate: pos.x,
                }),
                y: applyBoundsY({
                    boardState,
                    stageAttrs,
                    yCandidate: pos.y,
                }),
            }
        },
        [stageRef]
    )

    const onDragEnd = useCallback(
        (e: KonvaEventObject<DragEvent>) => {
            e.evt.preventDefault()
            updateStageAttrs(null)
        },
        [stageRef]
    )

    const onTouchMove = useCallback(
        (e: KonvaEventObject<TouchEvent>) => {
            e.evt.preventDefault()
            const stage = stageRef.current
            if (!stage) return

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

                const newAttrs = multiTouchMove({
                    stageAttrs: stage.getAttrs(),
                    p1,
                    p2,
                })

                updateStageAttrs(newAttrs)
            }
        },
        [stageRef]
    )

    const onTouchEnd = useCallback((e: KonvaEventObject<TouchEvent>) => {
        onTouchMove(e)
        multiTouchEnd()
    }, [])

    const { attrs } = store.getState().board.stage

    return (
        <div className="wrap">
            <UpdateStage stageRef={stageRef} />
            <ReactReduxContext.Consumer>
                {(value) => (
                    <Stage
                        className="stage"
                        ref={stageRef}
                        width={attrs.width}
                        height={attrs.height}
                        scaleX={attrs.scaleX}
                        scaleY={attrs.scaleY}
                        x={attrs.x}
                        y={attrs.y}
                        shadowForStrokeEnabled={false}
                        perfectDrawEnabled={false}
                        preventDefault
                        draggable={isPanMode}
                        dragBoundFunc={dragBoundFunc}
                        // onDragStart={onDragStart}
                        // onDragMove={onDragMove}
                        onDragEnd={onDragEnd}
                        onContextMenu={(e) => e.evt.preventDefault()}
                        onTouchMove={isPanMode ? undefined : onTouchMove}
                        onTouchEnd={isPanMode ? undefined : onTouchEnd}
                        onWheel={onWheel}
                    >
                        <ReactReduxContext.Provider value={value}>
                            <Content value={value} />
                        </ReactReduxContext.Provider>
                    </Stage>
                )}
            </ReactReduxContext.Consumer>
        </div>
    )
})
export default BoardStage
