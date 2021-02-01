import React, { useEffect, useState, memo } from "react"
import { ReactReduxContext, useSelector } from "react-redux"
import { Stage, Layer } from "react-konva"
import Viewbar from "../menu/viewbar"
import { SET_CURR_PAGE_IDX } from "../../redux/slice/drawcontrol"

import Page from "./page"
import PageListener from "./pagelistener"

import LiveLayer from "./livelayer"
import {
    CANVAS_WIDTH,
    ZOOM_IN_WHEEL_SCALE,
    ZOOM_OUT_WHEEL_SCALE,
    ZOOM_IN_SCALE,
    ZOOM_OUT_SCALE,
    ZOOM_SCALE_MAX,
    ZOOM_SCALE_MIN,
    CANVAS_HEIGHT,
    CANVAS_GAP,
} from "../../constants"
import store from "../../redux/store"

export default function BoardStage() {
    // console.log("BoardStage Memo Redraw")
    const isPanMode = useSelector((state) => state.drawControl.isPanMode)
    const [stageX, setStageX] = useState(0)
    const [stageY, setStageY] = useState(60)
    const [stageScale, setStageScale] = useState({ x: 1, y: 1 })

    const [stageWidth, setStageWidth] = useState(window.innerWidth)
    const [stageHeight, setStageHeight] = useState(window.innerHeight)

    useEffect(() => {
        const canvasY = (stageHeight / 2 - stageY) / stageScale.y
        const currentPageIndex = Math.floor(
            canvasY / (CANVAS_HEIGHT + CANVAS_GAP)
        )
        store.dispatch(SET_CURR_PAGE_IDX(currentPageIndex))
    }, [stageY, stageHeight, stageScale.y])

    useEffect(() => {
        window.addEventListener("resize", onWindowResize) // listen for resize to update stage dimensions
        centerPages()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    /**
     * Center the page or fit to page if zoomed in to page
     */
    function centerPages() {
        const x = (stageWidth - CANVAS_WIDTH * stageScale.x) / 2
        if (x >= 0) {
            setStageX(x)
        } else {
            fitToPage()
        }
        // setStageY()
    }

    /**
     * Fit page to window size while maintaining the y position
     */
    function fitToPage() {
        const oldScale = stageScale.x
        const newScale = window.innerWidth / CANVAS_WIDTH
        setStageScale({ x: newScale, y: newScale })
        setStageX(0)
        setStageY(
            stageHeight / 2 - ((stageHeight / 2 - stageY) / oldScale) * newScale
        )
    }

    /**
     * Handles window resize events
     */
    function onWindowResize() {
        setStageWidth(window.innerWidth)
        setStageHeight(window.innerHeight)
        centerPages()
    }

    /**
     * Handles updating the states after stage drag events
     * @param {event} e
     */
    function onDragEnd(e) {
        // if stage drag => update position states
        if (e.target.attrs.className === "stage") {
            // if stage is the drag object then update XY
            setStageX(e.target.attrs.x)
            setStageY(e.target.attrs.y)
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
                zoomTo(curserPosition, ZOOM_OUT_WHEEL_SCALE)
            } else {
                zoomTo(curserPosition, ZOOM_IN_WHEEL_SCALE)
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
                        setStageY(newY)
                        scrollActive = false
                    },
                })
            }
        }
    }

    /**
     * Zoom in canvas
     */
    function zoomIn() {
        const centerOfScreen = { x: stageWidth / 2, y: stageHeight / 2 }
        zoomTo(centerOfScreen, ZOOM_IN_SCALE)
    }

    /**
     * Zoom out canvas
     */
    function zoomOut() {
        const centerOfScreen = { x: stageWidth / 2, y: stageHeight / 2 }
        zoomTo(centerOfScreen, ZOOM_OUT_SCALE)
    }

    /**
     *
     * @param {object} position Desired zooming position.
     * @param {number} zoomScale The zooming step size.
     */
    function zoomTo(position, zoomScale) {
        const oldScale = stageScale.x
        const mousePointTo = {
            x: (position.x - stageX) / oldScale,
            y: (position.y - stageY) / oldScale,
        }
        let newScale = oldScale * zoomScale
        if (newScale > ZOOM_SCALE_MAX) {
            newScale = ZOOM_SCALE_MAX
        } else if (newScale < ZOOM_SCALE_MIN) {
            newScale = ZOOM_SCALE_MIN
        }

        setStageScale({ x: newScale, y: newScale })
        setStageX(position.x - mousePointTo.x * newScale)
        setStageY(position.y - mousePointTo.y * newScale)
    }

    return (
        <div className="wrap">
            <Viewbar
                fitToPage={fitToPage}
                center={centerPages}
                zoomIn={zoomIn}
                zoomOut={zoomOut}
            />
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
        const { currPageIndex } = state.drawControl
        const prlen = state.boardControl.present.pageRank.length // length of pageRank array
        const minPage = currPageIndex - 2 // Get min page candidate
        const maxPage = currPageIndex + 2 // Get max page candidate
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
