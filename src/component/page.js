import React, { useEffect, useRef } from "react"
import { nanoid } from "@reduxjs/toolkit"
import PageMenu from "./pagemenu.js"

import * as evl from "../board/eventlistener.js"
import * as constant from "../constants.js"

import store from "../redux/store.js"
import {
    actAddPage,
    actClearPage,
    actDeletePage,
    actDeleteAll,
} from "../redux/slice/boardcontrol.js"

export default function Whiteboard(props) {
    const liveCanvasRef = useRef()
    const mainCanvasRef = useRef()
    const pageId = props.pageId

    useEffect(() => {
        const mainCanvas = mainCanvasRef.current
        const liveCanvas = liveCanvasRef.current
        mainCanvas.width = constant.CANVAS_WIDTH //canvas.clientWidth;
        mainCanvas.height = constant.CANVAS_HEIGHT //canvas.clientHeight;
        liveCanvas.width = constant.CANVAS_WIDTH //canvas.clientWidth;
        liveCanvas.height = constant.CANVAS_HEIGHT //canvas.clientHeight;
        liveCanvas.addEventListener("contextmenu", (e) => e.preventDefault()) // Disable Context Menu
        liveCanvas.addEventListener("mousedown", (e) =>
            evl.handleCanvasMouseDown(e, props.scaleRef)
        )
        liveCanvas.addEventListener("mousemove", (e) =>
            evl.handleCanvasMouseMove(e)
        )
        liveCanvas.addEventListener("mouseup", (e) =>
            evl.handleCanvasMouseUp(e, pageId, mainCanvasRef)
        )
        liveCanvas.addEventListener("mouseleave", (e) =>
            evl.handleCanvasMouseLeave(e, pageId, mainCanvasRef)
        )
        // touch & stylus support
        liveCanvas.addEventListener("touchstart", (e) =>
            evl.handleCanvasMouseDown(e, props.scaleRef)
        )
        liveCanvas.addEventListener("touchmove", (e) =>
            evl.handleCanvasMouseMove(e)
        )
        liveCanvas.addEventListener("touchend", (e) =>
            evl.handleCanvasMouseUp(e, pageId, mainCanvasRef)
        )
        liveCanvas.addEventListener("touchcancel", (e) =>
            evl.handleCanvasMouseLeave(e, pageId, mainCanvasRef)
        )

        return () => {
            liveCanvas.removeEventListener("contextmenu", null)
            liveCanvas.removeEventListener("mousedown", null)
            liveCanvas.removeEventListener("mouseup", null)
            liveCanvas.removeEventListener("mousemove", null)
            liveCanvas.removeEventListener("mouseleave", null)
            // touch & stylus support
            liveCanvas.removeEventListener("touchstart", null)
            liveCanvas.removeEventListener("touchmove", null)
            liveCanvas.removeEventListener("touchend", null)
            liveCanvas.removeEventListener("touchcancel", null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="page">
            <div className="canvasWrapper">
                <canvas
                    className="canvasLive"
                    id={`${pageId}_live`}
                    ref={liveCanvasRef}
                />
                <canvas
                    className="canvasMain"
                    id={`${pageId}_main`}
                    ref={mainCanvasRef}
                />
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
