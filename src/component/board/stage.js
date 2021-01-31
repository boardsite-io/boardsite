import React, { useEffect, useState } from "react"
import { ReactReduxContext, useSelector } from "react-redux"
import { Stage, Layer } from "react-konva"
import Viewbar from "../menu/viewbar"

import Page from "./page"
import PageListener from "./pagelistener"

import LiveLayer from "./livelayer"
import {
    CANVAS_WIDTH,
    ZOOM_IN_WHEEL_SCALE,
    ZOOM_OUT_WHEEL_SCALE,
    ZOOM_IN_SCALE,
    ZOOM_OUT_SCALE,
} from "../../constants"

export default function BoardStage() {
    console.log("BoardStage Memo Redraw")
    const pageRank = useSelector((state) => state.boardControl.present.pageRank)
    const isDraggable = useSelector((state) => state.drawControl.isDraggable)
    const isListening = useSelector((state) => state.drawControl.isListening)
    const isPanMode = useSelector((state) => state.drawControl.isPanMode)

    const [stageX, setStageX] = useState(0)
    const [stageY, setStageY] = useState(60)
    const [stageWidth, setStageWidth] = useState(window.innerWidth)
    const [stageHeight, setStageHeight] = useState(window.innerHeight)
    const [stageScale, setStageScale] = useState({ x: 1, y: 1 })

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
        const newScale = oldScale * zoomScale
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
                            <Layer>
                                {pageRank.map((pageId) => (
                                    <PageListener
                                        key={pageId}
                                        pageId={pageId}
                                    />
                                ))}
                            </Layer>
                            <Layer>
                                {pageRank.map((pageId) => (
                                    <Page
                                        key={pageId}
                                        pageId={pageId}
                                        isDraggable={isDraggable}
                                        isListening={isListening}
                                    />
                                ))}
                            </Layer>
                            <LiveLayer />
                        </ReactReduxContext.Provider>
                    </Stage>
                )}
            </ReactReduxContext.Consumer>
        </div>
    )
}
