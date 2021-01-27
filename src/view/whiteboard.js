import React, { useState, useEffect, memo } from "react"
import { ActionCreators as UndoActionCreators } from "redux-undo"
import { useSelector } from "react-redux"
import FPSStats from "react-fps-stats"

import Page from "../component/board/page"
import { addPage } from "../component/menu/pagemenu"
import Toolbar from "../component/menu/toolbar"
import Homebar from "../component/menu/homebar"
// import Viewbar from "../component/menu/viewbar"
import AlertDialog from "../component/menu/session_dialog"
// import { useParams } from 'react-router-dom';
import { toolType } from "../constants"
import { SET_TYPE } from "../redux/slice/drawcontrol"
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

    // let scaleCopy
    // let positionXCopy
    // let positionYCopy
    // let setTransformCopy
    // const defaultPositionX = (window.innerWidth - (CANVAS_WIDTH + 45)) / 2
    // const defaultPositionY = 60
    // const defaultScale = 1

    // function scrollUp() {
    //     setTransformCopy(positionXCopy, positionYCopy + 200, scaleCopy)
    // }

    // function scrollDown() {
    //     setTransformCopy(positionXCopy, positionYCopy - 200, scaleCopy)
    // }

    // function stretchToWindow() {
    //     setTransformCopy(0, 0, window.innerWidth / (CANVAS_WIDTH + 45))
    // }

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

            {/* <MemoViewbar
                pan={pan}
                zoomIn={zoomIn}
                zoomOut={zoomOut}
                resetTransform={resetTransform}
                up={scrollUp}
                down={scrollDown}
                stretchToWindow={stretchToWindow}
            /> */}
            <MemoPages />
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
// const MemoViewbar = memo(Viewbar)
