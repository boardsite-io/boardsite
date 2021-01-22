import React from "react"
import { nanoid } from "@reduxjs/toolkit"
import PageMenu from "../menu/pagemenu.js"
import { Stage, Layer } from "react-konva"
import { StrokeShape } from "./stroke.js"
import * as constant from "../../constants.js"

import store from "../../redux/store.js"
import {
    actAddPage,
    actClearPage,
    actDeletePage,
    actDeleteAll,
} from "../../redux/slice/boardcontrol.js"
import { useSelector } from "react-redux"

import {
    startLiveStroke,
    moveLiveStroke,
    registerLiveStroke,
} from "./stroke.js"
import { MIN_SAMPLE_COUNT } from "../../constants.js"
import { setIsMouseDown } from "../../redux/slice/drawcontrol"

export default function Page(props) {
    const pageId = props.pageId
    const liveStrokePts = useSelector(
        (state) => state.drawControl.liveStroke.points[pageId]
    )
    const pageCollection = useSelector(
        (state) => state.boardControl.present.pageCollection
    )
    const isMouseDown = useSelector((state) => state.drawControl.isMouseDown)

    let sampleCount = 0

    function onMouseDown(e) {
        store.dispatch(setIsMouseDown(true))
        if (e.evt.buttons === 2) {
            return
        }
        //scaleFactor = 1 //CANVAS_PIXEL_RATIO / scaleRef.current
        sampleCount = 1

        const pos = e.target.getStage().getPointerPosition()
        // const relPos = {
        //     x: (e.evt.clientX - pos.x) * scaleFactor,
        //     y: (e.evt.clientY - pos.y) * scaleFactor,
        // }

        startLiveStroke(pos, pageId)
    }

    function onMouseMove(e) {
        if (!isMouseDown || e.evt.buttons === 2) {
            return
        }

        sampleCount += 1
        if (sampleCount > MIN_SAMPLE_COUNT) {
            const pos = e.target.getStage().getPointerPosition()
            // const relPos = {
            //     x: (e.evt.clientX - pos.x) * scaleFactor,
            //     y: (e.evt.clientY - pos.y) * scaleFactor,
            // }
            moveLiveStroke(pos)
            sampleCount = 0
        }
    }

    function onMouseUp(e) {
        if (!isMouseDown) {
            return
        } // Ignore reentering
        store.dispatch(setIsMouseDown(false))

        // update latest position
        const pos = e.target.getStage().getPointerPosition()

        registerLiveStroke(pos)
    }

    return (
        <div className="canvasWrapperOuter">
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
                        {Object.keys(pageCollection[pageId].strokes).map(
                            (strokeId, i) => (
                                <StrokeShape
                                    key={strokeId}
                                    stroke={
                                        pageCollection[pageId].strokes[strokeId]
                                    }
                                />
                            )
                        )}
                    </Layer>
                    <Layer>
                        {liveStrokePts !== undefined ? (
                            <StrokeShape
                                stroke={{
                                    ...store.getState().drawControl.liveStroke,
                                    points: liveStrokePts, // remove page_id key in points
                                }}
                            />
                        ) : (
                            <></>
                        )}
                    </Layer>
                </Stage>
            </div>
            <PageMenu pageId={pageId} />
        </div>
    )
}

// helper functions

export function addPage(pageId) {
    store.dispatch(
        actAddPage({
            pageId: nanoid(),
            pageIndex: store
                .getState()
                .boardControl.present.pageRank.indexOf(pageId),
        })
    )
}

export function clearPage(pageId) {
    store.dispatch(actClearPage(pageId))
}

export function deletePage(pageId) {
    store.dispatch(actDeletePage(pageId))
}

export function deleteAllPages(pageId) {
    store.dispatch(actDeleteAll())
}
