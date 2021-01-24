import React, { useState, useEffect, memo } from "react"
import { useSelector } from "react-redux"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"

import Page from "../component/board/page"
import { addPage } from "../component/menu/pagemenu"
import Toolbar from "../component/menu/toolbar"
import Homebar from "../component/menu/homebar"
import Viewbar from "../component/menu/viewbar"
import AlertDialog from "../component/menu/session_dialog"
// import { useParams } from 'react-router-dom';
import { toolType, CANVAS_WIDTH } from "../constants"
import { setType, setIsDraggable } from "../redux/slice/drawcontrol"
import store from "../redux/store"

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
            case "p":
                store.dispatch(setType(toolType.PEN))
                store.dispatch(setIsDraggable(false))
                break
            case "1":
                store.dispatch(setType(toolType.PEN))
                store.dispatch(setIsDraggable(false))
                break
            case "e":
                store.dispatch(setType(toolType.ERASER))
                store.dispatch(setIsDraggable(false))
                break
            case "2":
                store.dispatch(setType(toolType.ERASER))
                store.dispatch(setIsDraggable(false))
                break
            case "d":
                store.dispatch(setType(toolType.DRAG))
                store.dispatch(setIsDraggable(true))
                break
            case "3":
                store.dispatch(setType(toolType.DRAG))
                store.dispatch(setIsDraggable(true))
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

    let scale
    let positionX
    let positionY
    let setTransform
    const defaultPositionX = (window.innerWidth - (CANVAS_WIDTH + 45)) / 2
    const defaultPositionY = 60
    const defaultScale = 1

    function scrollUp() {
        setTransform(positionX, positionY + 200, scale)
    }

    function scrollDown() {
        setTransform(positionX, positionY - 200, scale)
    }

    function stretchToWindow() {
        setTransform(0, 0, window.innerWidth / (CANVAS_WIDTH + 45))
    }

    return (
        <div>
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
            <TransformWrapper
                defaultPositionX={defaultPositionX}
                defaultPositionY={defaultPositionY}
                defaultScale={defaultScale}
                options={{
                    disabled: false,
                    transformEnabled: true,
                    minPositionX: null,
                    maxPositionX: null,
                    minPositionY: null,
                    maxPositionY: null,
                    minScale: 0.5,
                    maxScale: 2,
                    limitToBounds: false,
                    limitToWrapper: false,
                    centerContent: true,
                }}
                wheel={{
                    disabled: false,
                    step: 200,
                    wheelEnabled: true,
                    touchPadEnabled: true,
                    limitsOnWheel: true,
                }}
                pan={{
                    disabled: true, // drawMode,
                    disableOnTarget: [],
                    lockAxisX: false,
                    lockAxisY: false,
                    velocity: false,
                    velocityEqualToMove: false,
                    velocitySensitivity: 1,
                    velocityMinSpeed: 1.2,
                    velocityBaseTime: 1800,
                    velocityAnimationType: "easeOut",
                    padding: true,
                    paddingSize: 40,
                    animationTime: 200,
                    animationType: "easeOut",
                }}
                pinch={{
                    disabled: false,
                }}
                zoomIn={{
                    disabled: false,
                    step: 70,
                    animation: true,
                    animationTime: 200,
                    animationType: "easeOut",
                }}
                zoomOut={{
                    disabled: false,
                    step: 70,
                    animation: true,
                    animationTime: 200,
                    animationType: "easeOut",
                }}
                doubleClick={{
                    disabled: false,
                    step: 70,
                    animation: true,
                    animationTime: 200,
                    animationType: "easeOut",
                    mode: "zoomIn",
                }}
                reset={{
                    disabled: false,
                    animation: true,
                    animationTime: 200,
                    animationType: "easeOut",
                }}
                scalePadding={{
                    disabled: true,
                }}
                // onWheelStart={}
                // onWheel={}
                // onWheelStop={}
                // onPanningStart={}
                // onPanning={}
                // onPanningStop={}
                // onPinchingStart={}
                // onPinching={}
                // onPinchingStop={}
                // onZoomChange={}
                // enablePadding={}
                // enablePanPadding={}
            >
                {({
                    pan,
                    zoomIn,
                    zoomOut,
                    resetTransform,
                    newPositionX,
                    newPositionY,
                    newScale,
                    newSetTransform,
                }) => {
                    // refresh values
                    scale = newScale
                    positionX = newPositionX
                    positionY = newPositionY
                    setTransform = newSetTransform

                    return (
                        <>
                            <MemoViewbar
                                pan={pan}
                                zoomIn={zoomIn}
                                zoomOut={zoomOut}
                                resetTransform={resetTransform}
                                up={scrollUp}
                                down={scrollDown}
                                stretchToWindow={stretchToWindow}
                            />
                            <TransformComponent>
                                <MemoPages />
                            </TransformComponent>
                        </>
                    )
                }}
            </TransformWrapper>
        </div>
    )
}

const Pages = () => {
    const pageRank = useSelector((state) => state.boardControl.present.pageRank)
    return (
        <div className="pagecollectionouter">
            <div className="pagecollectioninner">
                {pageRank.map((pageId) => (
                    <Page className="page" pageId={pageId} key={pageId} />
                ))}
            </div>
        </div>
    )
}
const MemoPages = memo(Pages) // memo to prevent redundant rerender on zooming / panning
const MemoViewbar = memo(Viewbar)
