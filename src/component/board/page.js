import React, { useState, useEffect } from "react"
import { nanoid } from "@reduxjs/toolkit"
import PageMenu from "../menu/pagemenu.js"
import { Stage, Layer, Rect, Circle } from "react-konva"
import { StrokeShape } from "./stroke.js"

import * as evl from "./eventlistener.js"
import * as constant from "../../constants.js"

import store from "../../redux/store.js"
import {
    actAddPage,
    actClearPage,
    actDeletePage,
    actDeleteAll,
} from "../../redux/slice/boardcontrol.js"
import { useSelector } from "react-redux"

export default function Whiteboard(props) {
    const [liveStroke, setLiveStroke] = useState({})
    const pageCollection = useSelector(
        (state) => state.boardControl.pageCollection
    )
    const pageId = props.pageId

    function onMouseDown(e) {
        evl.handleCanvasMouseDown(e, setLiveStroke, props.scaleRef)
    }

    function onMouseMove(e) {
        evl.handleCanvasMouseMove(e, setLiveStroke)
    }

    function onMouseUp(e) {
        evl.handleCanvasMouseUp(e, setLiveStroke, pageId)
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
                        {Object.keys(liveStroke).length > 0 ? (
                            <StrokeShape stroke={liveStroke} />
                        ) : null}
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
            pageIndex: store.getState().boardControl.pageRank.indexOf(pageId),
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
