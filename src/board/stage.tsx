import React, { useEffect, memo } from "react"
import { ReactReduxContext, ReactReduxContextValue } from "react-redux"
import { Stage, Layer } from "react-konva"
import { Vector2d } from "konva/types/types"
import { KonvaEventObject } from "konva/types/Node"
import { ToolType } from "drawing/stroke/types"
import { getPageMeta } from "drawing/stroke/actions"
import { createSelector } from "reselect"
import {
    CENTER_VIEW,
    ON_WINDOW_RESIZE,
    SET_STAGE_X,
    SET_STAGE_Y,
    SCROLL_STAGE_Y,
    ZOOM_TO,
    MULTI_TOUCH_MOVE,
    MULTI_TOUCH_END,
} from "../redux/slice/viewcontrol"
import { LiveStrokeShape } from "./stroke/shape"
import { ZOOM_IN_WHEEL_SCALE, ZOOM_OUT_WHEEL_SCALE } from "../constants"
import store, { RootState } from "../redux/store"
import { useCustomSelector } from "../redux/hooks"
import StrokeTransformer from "./transformer"
import PageListener from "./page/listener"
import PageContent from "./page/content"
import PageBackground from "./page/background"

const BoardStage: React.FC = () => {
    const isPanMode = useCustomSelector(
        (state) => state.drawControl.liveStroke.type === ToolType.Pan
    )
    const {
        stageWidth,
        stageHeight,
        stageX,
        stageY,
        stageScale,
        keepCentered,
    } = useCustomSelector((state) => state.viewControl)

    useEffect(() => {
        window.addEventListener("resize", () =>
            store.dispatch(ON_WINDOW_RESIZE())
        ) // listen for resize to update stage dimensions
        store.dispatch(CENTER_VIEW())
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
                            <StageContent value={value} />
                        </ReactReduxContext.Provider>
                    </Stage>
                )}
            </ReactReduxContext.Consumer>
        </div>
    )
}

export default BoardStage

// all pages and content are in this component
const StageContent = memo<{ value: ReactReduxContextValue }>(() => {
    // Only rerender on page change
    const pageCreateSelector = createSelector(
        (state: RootState) => state.boardControl.currentPageIndex,
        (state: RootState) => state.boardControl.pageRank,
        (currentPageIndex, pageRank) => pageRank[currentPageIndex]
    )
    const pageId = useCustomSelector(pageCreateSelector)

    if (pageId === undefined) {
        return null
    }

    const meta = getPageMeta(pageId)
    const props = {
        pageId,
        pageSize: {
            height: meta.height,
            width: meta.width,
            x: -meta.width / 2,
            y: 0,
        },
    }

    return (
        <>
            <Layer key={pageId}>
                <PageBackground {...props} />
                <PageListener {...props} />
                <PageContent {...props} />
            </Layer>
            <Layer draggable={false} listening={false}>
                <LiveStrokeShape />
            </Layer>
            <Layer>
                <StrokeTransformer />
            </Layer>
        </>
    )
})
