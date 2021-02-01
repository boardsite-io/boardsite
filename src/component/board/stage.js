import React, { useEffect, memo } from "react"
import { ReactReduxContext, useSelector } from "react-redux"
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
import { ZOOM_IN_WHEEL_SCALE, ZOOM_OUT_WHEEL_SCALE } from "../../constants"
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
    /**
     * Wheel event handler function
     * @param {event} e
     */
    function onWheel(e) {
        e.evt.preventDefault()
        if (isPanMode || e.evt.ctrlKey) {
            const curserPosition = e.target.getStage().getPointerPosition()
            if (e.evt.deltaY > 0) {
                store.dispatch(
                    ZOOM_TO({
                        zoomPoint: curserPosition,
                        zoomScale: ZOOM_OUT_WHEEL_SCALE,
                    })
                )
            } else {
                store.dispatch(
                    ZOOM_TO({
                        zoomPoint: curserPosition,
                        zoomScale: ZOOM_IN_WHEEL_SCALE,
                    })
                )
            }
        } else {
            const newY = stageY - e.evt.deltaY
            if (!scrollActive) {
                scrollActive = true
                const stage = e.target.getStage()
                stage.to({
                    y: newY,
                    duration: 0.1,
                    onFinish: () => {
                        store.dispatch(SET_STAGE_Y(newY))
                        scrollActive = false
                    },
                })
            }
        }
    }

    return (
        <div className="wrap">
            <ReactReduxContext.Consumer>
                {(value) => (
                    <Stage
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
    const pageRank = useSelector((state) => {
        const { currentActivePageId } = state.viewControl
        const prlen = state.boardControl.present.pageRank.length // length of pageRank array
        const minPage = currentActivePageId - 2 // Get min page candidate
        const maxPage = currentActivePageId + 2 // Get max page candidate
        const startPage = Math.max(minPage, 0) // Set start page index to candidate or to 0 if negative index
        const endPage = Math.min(maxPage + 1, prlen) // Set end page index; +1 because of slice indexing
        return state.boardControl.present.pageRank.slice(startPage, endPage)
    })

    return (
        <>
            <Layer>
                {pageRank.map((pageId) => (
                    <PageListener key={pageId} pageId={pageId} />
                ))}
            </Layer>
            <Layer>
                {pageRank.map((pageId) => (
                    <Page key={pageId} pageId={pageId} />
                ))}
            </Layer>
            <LiveLayer />
        </>
    )
})
