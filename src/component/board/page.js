import React, { memo } from "react"
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
    console.log("Page Redraw");
    const pageId = props.pageId
    const isMouseDown = useSelector((state) => state.drawControl.isMouseDown)
    const isActive = useSelector((state) => state.drawControl.isActive)
    let sampleCount = 0

    function onMouseDown(e) {
        if (e.evt.buttons === 2 || !isActive) {
            return
        }

        store.dispatch(setIsMouseDown(true))
        sampleCount = 1

        const pos = e.target.getStage().getPointerPosition()
        startLiveStroke(pos, pageId)
    }

    function onMouseMove(e) {
        if (!isMouseDown || e.evt.buttons === 2 || !isActive) {
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
        if (!isMouseDown || !isActive) {
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
                onMouseUp={onMouseUp} />
            <MemoPageMenu pageId={pageId} />
        </div>
    )
}

// memo for performance
const PageMenuComponent = (props) => { return <PageMenu pageId={props.pageId} /> }
const MemoPageMenu = memo(PageMenuComponent)

const PageComponent = (props) => {
    const liveStrokePts = useSelector((state) => state.drawControl.liveStroke.points[props.pageId])
    const pageCollection = useSelector((state) => state.boardControl.present.pageCollection[props.pageId])
    const isDraggable = useSelector((state) => state.drawControl.isDraggable)

    return (
        <div className="canvasWrapperInner">
            <Stage
                className="canvas"
                width={constant.CANVAS_WIDTH}
                height={constant.CANVAS_HEIGHT}
                onMouseDown={props.onMouseDown}
                onMousemove={props.onMouseMove}
                onMouseUp={props.onMouseUp}
                onMouseLeave={props.onMouseUp}
                onContextMenu={(e) => e.evt.preventDefault()}
                onTouchStart={props.onMouseDown}
                onTouchMove={props.onMouseMove}
                onTouchEnd={props.onMouseUp}>
                <Layer>
                    {Object.keys(pageCollection.strokes).map(
                        (strokeId, i) => (
                            <StrokeShape
                                key={strokeId}
                                stroke={pageCollection.strokes[strokeId]}
                                isDraggable={isDraggable}
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
                            isDraggable={isDraggable}
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
