import React, { useEffect, memo } from "react"
import { ReactReduxContext, useSelector } from "react-redux"
import { createSelector } from "reselect"
import { Stage, Layer } from "react-konva"
import {
    CENTER_VIEW,
    ON_WINDOW_RESIZE,
    SET_STAGE_X,
    SET_STAGE_Y,
    ZOOM_TO,
} from "../../redux/slice/viewcontrol"

import Page from "./page"
import PageListener from "./pagelistener"

import LiveLayer from "./livelayer"
import {
    ZOOM_IN_WHEEL_SCALE,
    ZOOM_OUT_WHEEL_SCALE,
    SCROLL_WHEEL_STEP,
    SCROLL_WHEEL_STEP_DURATION,
} from "../../constants"
import store from "../../redux/store"

export default function BoardStage() {
    // console.log("BoardStage Memo Redraw")
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
     * Handles updating the states after stage drag events
     * @param {event} e
     */
    function onDragEnd(e) {
        // if stage drag => update position states
        if (e.target.attrs.className === "stage") {
            // if stage is the drag object then update XY
            store.dispatch(SET_STAGE_X(e.target.attrs.x))
            store.dispatch(SET_STAGE_Y(e.target.attrs.y))
        }
    }

    let scrollActive = false
    let scrollBuffer = 0
    let newY
    /**
     * Wheel event handler function
     * @param {event} e
     */
    function onWheel(e) {
        e.evt.preventDefault()
        const isUp = e.evt.deltaY < 0

        if (isPanMode || e.evt.ctrlKey) {
            const curserPosition = e.target.getStage().getPointerPosition()
            let zoomScale
            if (isUp) {
                zoomScale = ZOOM_IN_WHEEL_SCALE
            } else {
                zoomScale = ZOOM_OUT_WHEEL_SCALE
            }
            store.dispatch(
                ZOOM_TO({
                    zoomPoint: curserPosition,
                    zoomScale,
                })
            )
        } else if (scrollActive) {
            if (isUp) {
                scrollBuffer += 1
            } else {
                scrollBuffer -= 1
            }
        } else {
            scrollActive = true
            const stage = e.target.getStage()
            if (isUp) {
                newY = stageY + SCROLL_WHEEL_STEP
            } else {
                newY = stageY - SCROLL_WHEEL_STEP
            }
            stage.to({
                y: newY,
                duration: SCROLL_WHEEL_STEP_DURATION,
                onFinish: () => handleFinish(newY, stage, isUp),
            })
        }
    }

    function handleFinish(updatedY, stage, isUp) {
        if (
            scrollBuffer === 0 ||
            (isUp && scrollBuffer < 0) ||
            (!isUp && scrollBuffer > 0)
        ) {
            // handle direction change and finished animations
            scrollActive = false
            store.dispatch(SET_STAGE_Y(updatedY)) // dispatch on the end of scrolling combo
        } else {
            const bufferY = updatedY + scrollBuffer * SCROLL_WHEEL_STEP
            const bufferDur =
                Math.abs(scrollBuffer) * SCROLL_WHEEL_STEP_DURATION
            scrollBuffer = 0
            stage.to({
                y: bufferY,
                duration: bufferDur,
                onFinish: () => handleFinish(bufferY, stage, isUp),
            })
        }
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
                        className="stage"
                        width={stageWidth}
                        height={stageHeight}
                        scale={stageScale}
                        x={stageX}
                        y={stageY}
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

const StageContent = memo(() => {
    // console.log("StageContent memo draw")
    const pageCreateSelector = createSelector(
        (state) => state.boardControl.present.pageRank,
        (state) => state.viewControl.currentPageId,
        (pageRank, currentPageId) => {
            const minPage = currentPageId - 2 // Get min page candidate
            const maxPage = currentPageId + 2 // Get max page candidate
            const startPage = Math.max(minPage, 0) // Set start page index to candidate or to 0 if negative index
            const endPage = Math.min(maxPage + 1, pageRank.length) // Set end page index; +1 because of slice indexing
            return pageRank.slice(startPage, endPage)
        }
    )

    const pageSelector = useSelector(pageCreateSelector)
    const isDraggable = useSelector((state) => state.drawControl.isDraggable)
    const isListening = useSelector((state) => state.drawControl.isListening)
    const isPanMode = useSelector((state) => state.drawControl.isPanMode)

    return (
        <>
            <Layer
                draggable={isDraggable}
                listening={!isPanMode && !isListening}>
                {pageSelector.map((pageId) => (
                    <PageListener key={pageId} pageId={pageId} />
                ))}
            </Layer>
            <Layer
                draggable={isDraggable}
                listening={!isPanMode && isListening}>
                {pageSelector.map((pageId) => (
                    <Page key={pageId} pageId={pageId} />
                ))}
            </Layer>
            <Layer draggable={false} listening={false}>
                <LiveLayer />
            </Layer>
        </>
    )
})
