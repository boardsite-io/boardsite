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
import {
    applyBoundsX,
    applyBoundsY,
    multiTouchEnd,
    multiTouchMove,
    zoomTo,
    DetectionResult,
    detectPageChange,
    toNextPage,
    toPreviousPage,
} from "drawing/stage"
import {
    DECREMENT_PAGE_INDEX,
    INCREMENT_PAGE_INDEX,
    ON_WINDOW_RESIZE,
    SET_STAGE_ATTRS,
} from "redux/board"
import store from "redux/store"
import { useCustomSelector } from "hooks"
import { debounce } from "lodash"
import { ToolType } from "drawing/stroke/index.types"
import { KonvaEventObject } from "konva/lib/Node"
import { StageAttrs } from "redux/board/index.types"
import { Vector2d } from "konva/lib/types"
import StageContent from "./StageContent"
import StageUpdate from "./StageUpdate"

const resizeStage = debounce(() => {
    store.dispatch(ON_WINDOW_RESIZE())
}, STAGE_RESIZE_DEBOUNCE)

const updateRedux = debounce((stageAttrs: StageAttrs) => {
    store.dispatch(SET_STAGE_ATTRS(stageAttrs))
}, STAGE_UPDATE_DEBOUNCE)

const BoardStage: React.FC = memo(() => {
    useEffect(() => window.addEventListener("resize", resizeStage), [])

    const stageRef = useRef<StageType>(null)

    const isPanMode = useCustomSelector(
        (state) => state.drawing.tool.type === ToolType.Pan
    )

    const updateStageAttrs = useCallback(
        (attrsUpdate: StageAttrs | null): void => {
            const stage = stageRef.current

            if (!stage) {
                return
            }

            if (attrsUpdate === null) {
                attrsUpdate = stage.getAttrs() as StageAttrs
            }

            // Copy to prevent mutating stage.getAttrs() directly
            let newAttrs = { ...attrsUpdate }
            const boardState = store.getState().board

            // Check if page index should change
            const detectionResult = detectPageChange(boardState, newAttrs)

            if (detectionResult === DetectionResult.Next) {
                toNextPage(boardState, newAttrs)
                store.dispatch(INCREMENT_PAGE_INDEX())
            } else if (detectionResult === DetectionResult.Previous) {
                toPreviousPage(boardState, newAttrs)
                store.dispatch(DECREMENT_PAGE_INDEX())
            } else {
                // Apply bounds before using new stage attributes
                newAttrs = {
                    ...newAttrs,
                    x: applyBoundsX({
                        boardState,
                        stageAttrs: newAttrs,
                        xCandidate: newAttrs.x,
                    }),
                    y: applyBoundsY({
                        boardState,
                        stageAttrs: newAttrs,
                        yCandidate: newAttrs.y,
                    }),
                }
            }

            // Update internal state
            stage.setAttrs(newAttrs)

            // Synchronise the redux state with the internal state
            updateRedux(newAttrs)
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
            if (!stage) {
                return
            }

            const stageAttrs = stage.getAttrs()

            if (isPanMode || e.evt.ctrlKey) {
                const zoomPoint = stage.getPointerPosition()
                if (!zoomPoint) {
                    return
                }

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
            if (!stage) {
                return pos
            }

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
            if (!stage) {
                return
            }

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
            <StageUpdate stageRef={stageRef} />
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
                            <StageContent value={value} />
                        </ReactReduxContext.Provider>
                    </Stage>
                )}
            </ReactReduxContext.Consumer>
        </div>
    )
})
export default BoardStage
