import React from "react"
import { ReactReduxContext, useSelector } from "react-redux"
import { Stage, Layer } from "react-konva"

import Page from "./page"
import PageBackground from "./pagebackground"

import LiveLayer from "./livelayer"
import { startLiveStroke, moveLiveStroke, registerLiveStroke } from "./stroke"
import { SET_ISMOUSEDOWN } from "../../redux/slice/drawcontrol"
import store from "../../redux/store"
import { toolType, MIN_SAMPLE_COUNT } from "../../constants"

export default function BoardStage() {
    const pageRank = useSelector((state) => state.boardControl.present.pageRank)
    const isDraggable = useSelector((state) => state.drawControl.isDraggable)
    const isMouseDown = useSelector((state) => state.drawControl.isMouseDown)
    const isActive = useSelector((state) => state.drawControl.isActive)
    const tool = useSelector((state) => state.drawControl.liveStroke.type)

    let sampleCount = 0

    function getScaledPointerPosition(e) {
        const stage = e.target.getStage()
        const position = stage.getPointerPosition()
        const transform = stage.getAbsoluteTransform().copy().invert()
        return transform.point(position)
    }

    function onMouseDown(e) {
        if (
            e.evt.buttons === 2 || // ignore right click eraser, i.e. dont start stroke
            !isActive ||
            tool === toolType.DRAG
        ) {
            return
        }

        if (tool === toolType.ERASER) {
            store.dispatch(SET_ISMOUSEDOWN(true))
            return
        }

        store.dispatch(SET_ISMOUSEDOWN(true))
        sampleCount = 1

        const pos = getScaledPointerPosition(e)
        startLiveStroke(pos, pageRank[0]) // todo get pageid
    }

    function onMouseMove(e) {
        if (
            !isMouseDown ||
            !isActive ||
            e.evt.buttons === 2 || // right mouse
            e.evt.buttons === 3 || // left+right mouse
            tool === toolType.DRAG
        ) {
            // cancel stroke when right / left+right mouse is clicked
            // store.dispatch(SET_ISMOUSEDOWN(false))
            return
        }
        if (tool === toolType.ERASER) {
            return
        }

        sampleCount += 1
        if (tool !== toolType.PEN) {
            // for all tools except pen we want to redraw on every update
            const pos = getScaledPointerPosition(e)
            moveLiveStroke(pos)
        } else if (sampleCount > MIN_SAMPLE_COUNT) {
            // for pen tool we skip some samples to improve performance
            const pos = getScaledPointerPosition(e)
            moveLiveStroke(pos)
            sampleCount = 0
        }
    }

    function onMouseUp(e) {
        if (!isMouseDown || !isActive || toolType === toolType.DRAG) {
            return
        } // Ignore reentering
        if (tool === toolType.ERASER) {
            store.dispatch(SET_ISMOUSEDOWN(false))
            return
        }
        store.dispatch(SET_ISMOUSEDOWN(false))

        // update last position
        const pos = getScaledPointerPosition(e)
        moveLiveStroke(pos)

        // register finished stroke
        registerLiveStroke()
    }

    function onWheel(e) {
        e.evt.preventDefault()
        const zoomWheelStep = 0.9
        const stage = e.target.getStage()
        const oldScale = stage.scaleX()
        const pointer = stage.getPointerPosition()
        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        }
        const newScale =
            e.evt.deltaY > 0
                ? oldScale * zoomWheelStep
                : oldScale / zoomWheelStep
        stage.scale({ x: newScale, y: newScale })
        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        }
        stage.position(newPos)
        stage.batchDraw()
    }

    // function onDragEnd(e) {
    //     console.log(e)
    // }

    return (
        <div className="pagecollectionouter">
            <div className="pagecollectioninner">
                <ReactReduxContext.Consumer>
                    {(value) => (
                        <Stage
                            draggable={!isActive}
                            className="stage"
                            width={window.innerWidth}
                            height={window.innerHeight}
                            onMouseDown={onMouseDown}
                            onMousemove={onMouseMove}
                            onMouseUp={onMouseUp}
                            onMouseLeave={onMouseUp}
                            onContextMenu={(e) => e.evt.preventDefault()}
                            onTouchStart={onMouseDown}
                            onTouchMove={onMouseMove}
                            onTouchEnd={onMouseUp}
                            // onDragEnd={onDragEnd}
                            onWheel={onWheel}>
                            <ReactReduxContext.Provider value={value}>
                                <Layer>
                                    {pageRank.map((pageId) => (
                                        <PageBackground
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
                                        />
                                    ))}
                                </Layer>
                                <LiveLayer />
                            </ReactReduxContext.Provider>
                        </Stage>
                    )}
                </ReactReduxContext.Consumer>
            </div>
        </div>
    )
}
