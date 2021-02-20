import React, { useEffect, memo } from "react"
import { ReactReduxContext, useSelector } from "react-redux"
import { createSelector } from "reselect"
import { Stage, Layer } from "react-konva"
import {
    CENTER_VIEW,
    ON_WINDOW_RESIZE,
    SET_STAGE_X,
    SET_STAGE_Y,
    SCROLL_STAGE_Y,
    ZOOM_TO,
} from "../../redux/slice/viewcontrol"

import Page from "./page"
import PageListener from "./pagelistener"

import LiveLayer from "./livelayer"
import {
    ZOOM_IN_WHEEL_SCALE,
    ZOOM_OUT_WHEEL_SCALE,
    CANVAS_WIDTH,
} from "../../constants"
import store from "../../redux/store"

export default function BoardStage() {
    const isPanMode = useSelector((state) => state.drawControl.isPanMode)
    const stageWidth = useSelector((state) => state.viewControl.stageWidth)
    const stageHeight = useSelector((state) => state.viewControl.stageHeight)
    const stageX = useSelector((state) => state.viewControl.stageX)
    const stageY = useSelector((state) => state.viewControl.stageY)
    const stageScale = useSelector((state) => state.viewControl.stageScale)

    useEffect(() => {
        window.addEventListener("resize", () =>
            store.dispatch(ON_WINDOW_RESIZE())
        ) // listen for resize to update stage dimensions
        store.dispatch(CENTER_VIEW())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    /**
     * Wheel event handler function
     * @param {event} e
     */
    function onWheel(e) {
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
                    zoomPoint: e.target.getStage().getPointerPosition(),
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
    function onDragEnd(e) {
        if (e.target.attrs.className === "stage") {
            store.dispatch(SET_STAGE_X(e.target.attrs.x))
            store.dispatch(SET_STAGE_Y(e.target.attrs.y))
        }
    }

    /**
     *
     * @param {object} pos current position of drag event on stage, e.g. {x: 12, y: 34}
     */
    function dragBound(pos) {
        const x = (stageWidth - CANVAS_WIDTH * stageScale.x) / 2
        if (x >= 0) {
            return { x, y: pos.y }
        }

        return pos
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

// all pages and content are in this component
const StageContent = memo(() => {
    const pageCreateSelector = createSelector(
        (state) => state.boardControl.present.pageRank,
        (state) => state.viewControl.currentPageIndex,
        (pageRank, currentPageIndex) => {
            const minPage = currentPageIndex - 2 // Get min page candidate
            const maxPage = currentPageIndex + 2 // Get max page candidate
            const startPage = Math.max(minPage, 0) // Set start page index to candidate or to 0 if negative index
            const endPage = Math.min(maxPage + 1, pageRank.length) // Set end page index; +1 because of slice indexing
            const pageSlice = pageRank.slice(startPage, endPage)
            return { pageSlice, startPage } // todo: draw at correct position
        }
    )

    const pageSelector = useSelector(pageCreateSelector)
    return (
        <>
            <Layer>
                {pageSelector.pageSlice.map((pageId, i) => (
                    <>
                        <PageListener
                            key={pageId}
                            pageId={pageId}
                            currentPageIndex={pageSelector.startPage + i}
                        />
                        <Page
                            key={pageId}
                            pageId={pageId}
                            currentPageIndex={pageSelector.startPage + i}
                        />
                    </>
                ))}
            </Layer>
            <Layer draggable={false} listening={false}>
                <LiveLayer />
            </Layer>
        </>
    )
})
