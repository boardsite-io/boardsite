import React, { memo } from "react"
import { useSelector } from "react-redux"
import { Stage, Layer } from "react-konva"
import PageMenu from "../menu/pagemenu"
import * as constant from "../../constants"

import store from "../../redux/store"

import {
    StrokeShape,
    startLiveStroke,
    moveLiveStroke,
    registerLiveStroke,
} from "./stroke"
import { MIN_SAMPLE_COUNT, toolType } from "../../constants"
import { setIsMouseDown } from "../../redux/slice/drawcontrol"

export default function Page({ pageId }) {
    // console.log("Page Redraw");
    const isMouseDown = useSelector((state) => state.drawControl.isMouseDown)
    const isActive = useSelector((state) => state.drawControl.isActive)
    const tool = useSelector((state) => state.drawControl.liveStroke.type)
    let sampleCount = 0

    function onMouseDown(e) {
        if (
            e.evt.buttons === 2 || // ignore right click eraser, i.e. dont start stroke
            !isActive ||
            tool === toolType.DRAG
        ) {
            return
        }

        store.dispatch(setIsMouseDown(true))
        sampleCount = 1

        const pos = e.target.getStage().getPointerPosition()
        startLiveStroke(pos, pageId)
    }

    function onMouseMove(e) {
        if (
            !isMouseDown ||
            e.evt.buttons === 2 || // right mouse
            e.evt.buttons === 3 || // left+right mouse
            !isActive ||
            toolType === toolType.DRAG
        ) {
            // cancel stroke when right / left+right mouse is clicked
            store.dispatch(setIsMouseDown(false))
            return
        }

        sampleCount += 1
        if (sampleCount > MIN_SAMPLE_COUNT) {
            const pos = e.target.getStage().getPointerPosition()
            moveLiveStroke(pos)
            sampleCount = 0
        }
    }

    function onMouseUp(e) {
        if (!isMouseDown || !isActive || toolType === toolType.DRAG) {
            return
        } // Ignore reentering
        store.dispatch(setIsMouseDown(false))

        // update last position
        const pos = e.target.getStage().getPointerPosition()
        moveLiveStroke(pos)

        // register finished stroke
        registerLiveStroke()
    }

    return (
        <div className="canvasWrapperOuter">
            <MemoPage
                pageId={pageId}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
            />
            <MemoPageMenu pageId={pageId} />
        </div>
    )
}
// memo for performance
const PageMenuComponent = ({ pageId }) => <PageMenu pageId={pageId} />
const MemoPageMenu = memo(PageMenuComponent)

const PageComponent = ({ pageId, onMouseDown, onMouseMove, onMouseUp }) => {
    const liveStrokePts = useSelector(
        (state) => state.drawControl.liveStroke.points[pageId]
    )
    const pageCollection = useSelector(
        (state) => state.boardControl.present.pageCollection[pageId]
    )
    const isDraggable = useSelector((state) => state.drawControl.isDraggable)

    return (
        <div className="canvasWrapperInner">
            <Stage
                className="canvas"
                width={constant.CANVAS_WIDTH}
                height={constant.CANVAS_HEIGHT}
                onMouseDown={onMouseDown}
                onMousemove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                onContextMenu={(e) => e.evt.preventDefault()}
                onTouchStart={onMouseDown}
                onTouchMove={onMouseMove}
                onTouchEnd={onMouseUp}>
                <Layer>
                    {Object.keys(pageCollection.strokes).map((strokeId) => (
                        <StrokeShape
                            key={strokeId}
                            stroke={pageCollection.strokes[strokeId]}
                            isDraggable={isDraggable}
                        />
                    ))}
                </Layer>
                <Layer>
                    {liveStrokePts !== undefined ? (
                        <StrokeShape
                            stroke={{
                                ...store.getState().drawControl.liveStroke,
                                points: liveStrokePts, // remove pageId key in points
                            }}
                        />
                    ) : (
                        <></>
                    )}
                </Layer>
            </Stage>
        </div>
    )
}
const MemoPage = memo(PageComponent)
