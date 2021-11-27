import React, { memo, useCallback, useEffect, useRef } from "react"
import { ReactReduxContext } from "react-redux"
import { Stage } from "react-konva"
import { Stage as StageType } from "konva/lib/Stage"
import {
    pageSize,
    STAGE_RESIZE_DEBOUNCE,
    STAGE_UPDATE_DEBOUNCE,
    ZOOM_IN_WHEEL_SCALE,
    ZOOM_OUT_WHEEL_SCALE,
} from "consts"
import { ON_WINDOW_RESIZE, SET_STAGE_ATTRS } from "redux/board/board"
import store from "redux/store"
import { useCustomSelector } from "hooks"
import { debounce } from "lodash"
import { ToolType } from "drawing/stroke/types"
import { Vector2d } from "konva/lib/types"
import { KonvaEventObject } from "konva/lib/Node"
import { StageAttrs } from "redux/board/board.types"
import { zoomTo } from "./util/adjustView"
import { multiTouchEnd, multiTouchMove } from "./util/multiTouch"
import Content from "./content"
import { detectPageChange } from "./util/detectPageChange"
import { UpdateStage } from "./updateStage"

const BoardStage: React.FC = memo(() => {
    useEffect(() => window.addEventListener("resize", resizeStage), [])
    const stageRef = useRef<StageType>(null)

    const isPanMode = useCustomSelector(
        (state) => state.drawing.tool.type === ToolType.Pan
    )

    const onResize = useCallback(() => {
        store.dispatch(ON_WINDOW_RESIZE())
    }, [])

    const onUpdate = useCallback(
        (stageAttrs: StageAttrs) => {
            store.dispatch(SET_STAGE_ATTRS(stageAttrs))
        },
        [store]
    )

    const resizeStage = debounce(onResize, STAGE_RESIZE_DEBOUNCE)
    const updateRedux = debounce(onUpdate, STAGE_UPDATE_DEBOUNCE)

    const updateStageAttrs = useCallback(
        (newAttrs: StageAttrs) => {
            // Copy to prevent mutating stage.getAttrs() directly
            const attrsCopy = { ...newAttrs }

            const stage = stageRef.current
            if (!stage) return

            // Check if page index should change
            const isDetected = detectPageChange(
                store.getState().board,
                attrsCopy
            )

            if (!isDetected) {
                // Update internal state
                stage.setAttrs(attrsCopy)

                // Synchronise the redux state with the internal state
                updateRedux(attrsCopy)
            }
        },
        [stageRef]
    )

    /**
     *
     * @param {object} pos current position of drag event on stage, e.g. {x: 12, y: 34}
     */
    const dragBound = useCallback(
        (pos: Vector2d) => {
            const stage = stageRef.current

            if (stage && store.getState().board.stage.keepCentered) {
                const x = stage.getAttr("width") / 2
                if (x >= 0) {
                    return { x, y: pos.y }
                }
            }

            return pos
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

            if (isPanMode || e.evt.ctrlKey) {
                const zoomPoint = stage.getPointerPosition()
                if (!zoomPoint) return

                const {
                    currentPageIndex,
                    pageCollection,
                    stage: { keepCentered },
                } = store.getState().board

                const pageWidth =
                    pageCollection[currentPageIndex]?.meta.size.width ??
                    pageSize.a4landscape.width

                const newAttrs = zoomTo({
                    stageAttrs: stage.getAttrs(),
                    zoomPoint,
                    zoomScale:
                        e.evt.deltaY < 0
                            ? ZOOM_IN_WHEEL_SCALE
                            : ZOOM_OUT_WHEEL_SCALE,
                    keepCentered,
                    pageWidth,
                })

                updateStageAttrs(newAttrs)
            } else {
                const stageAttrs = stage.getAttrs()
                const newAttrs = {
                    ...stageAttrs,
                    x: stageAttrs.x - e.evt.deltaX,
                    y: stageAttrs.y - e.evt.deltaY,
                }

                updateStageAttrs(newAttrs)
            }
        },
        [isPanMode]
    )

    /**
     * Handles updating the states after stage drag events
     * @param {event} e
     */
    const onDragEnd = useCallback((e: KonvaEventObject<DragEvent>) => {
        if (e.target.attrs.className === "stage") {
            const stage = stageRef.current
            if (!stage) return

            const newAttrs = stage.getAttrs()

            updateStageAttrs(newAttrs)
        }
    }, [])

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
                    attrs: stage.getAttrs(),
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

        const stage = stageRef.current
        if (!stage) return
        const newAttrs = stage.getAttrs()
        updateStageAttrs(newAttrs)
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
                        dragBoundFunc={dragBound}
                        // onDragStart={onDragStart}
                        // onDragMove={onDragMove}
                        onDragEnd={onDragEnd}
                        onContextMenu={(e) => e.evt.preventDefault()}
                        onTouchMove={isPanMode ? undefined : onTouchMove}
                        onTouchEnd={isPanMode ? undefined : onTouchEnd}
                        onWheel={onWheel}>
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
