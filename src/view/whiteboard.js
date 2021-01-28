import React, { useState, useEffect } from "react"
import { ActionCreators as UndoActionCreators } from "redux-undo"
import { useSelector } from "react-redux"
import FPSStats from "react-fps-stats"
import { Stage, Layer } from "react-konva"

import LiveLayer from "../component/board/livelayer"

// import Page from "../component/board/page"
import { addPage } from "../component/menu/pagemenu"
import Toolbar from "../component/menu/toolbar"
import Homebar from "../component/menu/homebar"
import Viewbar from "../component/menu/viewbar"
import AlertDialog from "../component/menu/session_dialog"
// import { useParams } from 'react-router-dom';
import {
    toolType,
    MIN_SAMPLE_COUNT,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
} from "../constants"
import { SET_TYPE, SET_ISMOUSEDOWN } from "../redux/slice/drawcontrol"
import store from "../redux/store"

import {
    startLiveStroke,
    moveLiveStroke,
    registerLiveStroke,
    StrokeShape,
} from "../component/board/stroke"

// import * as api from '../util/api';
// import * as proc from '../util/processing.js';
// import * as control from '../util/boardcontrol';

export default function Whiteboard() {
    // console.log("Whiteboard Redraw");
    const [openSessionDialog, setOpenSessionDialog] = useState(false)
    const [sidInput, setSidInput] = useState("")

    // const pageRank = useSelector(state => state.boardControl.present.pageRank)
    // Connect to session if valid session link
    // useEffect(() => {
    //     if (id !== undefined) { // Check if id specified in link
    //         setSessionID(id); // Set session id and connect to session
    //     }
    // }, [id])
    function handleKeyPress(e) {
        switch (e.key) {
            case "p": // Pen
                store.dispatch(SET_TYPE(toolType.PEN))
                break
            case "1": // Pen
                store.dispatch(SET_TYPE(toolType.PEN))
                break
            case "e": // Eraser
                store.dispatch(SET_TYPE(toolType.ERASER))
                break
            case "2": // Eraser
                store.dispatch(SET_TYPE(toolType.ERASER))
                break
            case "d": // Drag
                store.dispatch(SET_TYPE(toolType.DRAG))
                break
            case "3": // Drag
                store.dispatch(SET_TYPE(toolType.DRAG))
                break
            case "l": // Line
                store.dispatch(SET_TYPE(toolType.LINE))
                break
            case "4": // Line
                store.dispatch(SET_TYPE(toolType.LINE))
                break
            case "t": // Triangle
                store.dispatch(SET_TYPE(toolType.TRIANGLE))
                break
            case "5": // Triangle
                store.dispatch(SET_TYPE(toolType.TRIANGLE))
                break
            case "c": // Circle
                store.dispatch(SET_TYPE(toolType.CIRCLE))
                break
            case "6": // Circle
                store.dispatch(SET_TYPE(toolType.CIRCLE))
                break
            case "z": // Undo (Ctrl + Z)
                if (e.ctrlKey && !e.repeat) {
                    store.dispatch(UndoActionCreators.undo())
                }
                break
            case "y": // Redo (Ctrl + Y)
                if (e.ctrlKey && !e.repeat) {
                    store.dispatch(UndoActionCreators.redo())
                }
                break
            default:
                break
        }
    }

    // Open dialog on mount
    useEffect(() => {
        // setOpenSessionDialog(true);
        addPage()
        document.addEventListener("keypress", handleKeyPress)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Verify session id and try to connect to session
    // useEffect(() => {
    //     if (sessionID !== "") {
    //         api.createWebsocket(sessionID, onMsgHandle, null, null,).then((socket) => {
    //             // wsRef.current = socket;
    //             console.log(sessionID);
    //             navigator.clipboard.writeText(sessionID); // copy session ID to clipboard
    //         }).catch(() => console.log(`cannot connect websocket on '/${sessionID}'`));
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [sessionID])

    // Handles messages from the websocket
    // function onMsgHandle(data) {
    //     const strokeObjectArray = JSON.parse(data.data);
    //     if (strokeObjectArray.length === 0) {
    //         actPage.deleteAll(setStrokeCollection, setHitboxCollection, setUndoStack, setRedoStack, pageCollection, setPageCollection);
    //     }
    //     else {
    //         let pageId = strokeObjectArray[0].pageId;
    //         let canvasRef = pageCollection[pageId];
    //         proc.processStrokes(strokeObjectArray, "message", setStrokeCollection, setHitboxCollection,
    //             setUndoStack, wsRef, canvasRef);
    //     }
    // }

    function handleCreate() {
        // let boardDim = { x: 10, y: 10 };
        // api.createBoardRequest(boardDim).then((data) => {
        //     api.getPages(data.id).then((data) => {
        //         console.log(data);
        //         setSessionID(data.id);
        //         setOpenSessionDialog(false); // close dialog
        //     }).catch(() => console.log("server cannot get pages"));
        // }).catch(() => console.log("server cannot create session"));
    }

    function handleJoin() {
        // setSessionID(sidInput);
    }

    function handleTextFieldChange() {
        // setSidInput(e.target.value)
    }

    // const pageRank = useSelector((state) => state.boardControl.present.pageRank)
    const liveStrokePts = useSelector(
        (state) => state.drawControl.liveStroke.points
    )
    // const pageCollection = useSelector(
    //     (state) => state.boardControl.present.pageCollection
    // )
    const strokeCollection = useSelector(
        (state) => state.boardControl.present.strokeCollection
    )
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
        startLiveStroke(pos)
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

    const zoomWheelStep = 0.9
    function onWheel(e) {
        e.evt.preventDefault()
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

    function onDragEnd(e) {
        console.log(e)
    }

    return (
        <div>
            <FPSStats />
            <AlertDialog
                open={openSessionDialog}
                setOpen={setOpenSessionDialog}
                sessionID_input={sidInput}
                setSessionID_input={setSidInput}
                handleTextFieldChange={handleTextFieldChange}
                handleJoin={handleJoin}
                handleCreate={handleCreate}
            />
            <Toolbar />
            <Homebar setOpenSessionDialog={setOpenSessionDialog} />
            <Viewbar />
            <div className="pagecollectionouter">
                <div className="pagecollectioninner">
                    <Stage
                        draggable={!isActive}
                        className="stage"
                        width={CANVAS_WIDTH}
                        height={CANVAS_HEIGHT}
                        // width={window.innerWidth}
                        // height={CANVAS_HEIGHT}
                        onMouseDown={onMouseDown}
                        onMousemove={onMouseMove}
                        onMouseUp={onMouseUp}
                        onMouseLeave={onMouseUp}
                        onContextMenu={(e) => e.evt.preventDefault()}
                        onTouchStart={onMouseDown}
                        onTouchMove={onMouseMove}
                        onTouchEnd={onMouseUp}
                        onDragEnd={onDragEnd}
                        onWheel={onWheel}>
                        <Layer>
                            {Object.keys(strokeCollection).map((strokeId) => (
                                <StrokeShape
                                    key={strokeId}
                                    stroke={strokeCollection[strokeId]}
                                    isDraggable={isDraggable}
                                />
                            ))}
                        </Layer>
                        <LiveLayer sel={liveStrokePts} />
                    </Stage>
                </div>
            </div>
        </div>
    )
}
