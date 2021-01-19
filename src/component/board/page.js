import React, { useEffect, useRef } from "react"
import { nanoid } from "@reduxjs/toolkit"
import PageMenu from "../menu/pagemenu.js"
import { Stage, Layer, Rect } from "react-konva"

import * as evl from "./eventlistener.js"
import * as constant from "../../constants.js"

import store from "../../redux/store.js"
import {
    actAddPage,
    actClearPage,
    actDeletePage,
    actDeleteAll,
} from "../../redux/slice/boardcontrol.js"

export default function Whiteboard(props) {
    const pageId = props.pageId


    function onMouseDown(e) {
        evl.handleCanvasMouseDown(e, props.scaleRef)
    }

    function onMouseup(e) {
        evl.handleCanvasMouseUp(e, pageId)
    }

    return (
        <div className="page">
            <div className="canvasWrapper">
            <Stage
                width={constant.CANVAS_WIDTH}
                height={constant.CANVAS_HEIGHT}
                onMouseDown={onMouseDown}
                onMousemove={evl.handleCanvasMouseMove}
                onMouseup={onMouseup}
                onMouseLeave={onMouseup}
                onContextMenu={(e) => e.preventDefault()}
                onTouchStart={onMouseDown}
                onTouchMove={evl.handleCanvasMouseMove}
                onTouchEnd={onMouseup}
            >
                <Layer>
                    <Rect width={50} height={50} fill="red" />
                </Layer>
            </Stage>
            <PageMenu pageId={pageId} />
            </div>
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
