import React, { useState, useEffect, useRef, createRef } from 'react';
import Whiteboard from './whiteboard';
import Toolbar from './toolbar';
import Homebar from './homebar';
import Viewbar from './viewbar';
import AlertDialog from '../component/session_dialog';
import { useParams } from 'react-router-dom';
import * as api from '../util/api';
import * as proc from '../util/processing.js';
import * as actPage from '../util/actionsPage.js';
import * as actData from '../util/actionsData.js';

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

function WhiteboardControl() {
    const defaultScale = 0.8 * window.innerWidth / 710;
    const defaultPositionX = (1 - 0.8)/2 * window.innerWidth;
    const defaultPositionY = 60;

    const { id } = useParams();
    const [sessionID, setSessionID] = useState("");
    const [sidInput, setSidInput] = useState("");
    
    const [pageCollection, setPageCollection] = useState([]);
    const [strokeCollection, setStrokeCollection] = useState({});
    const [hitboxCollection, setHitboxCollection] = useState({});
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const [strokeStyle, setStrokeStyle] = useState("#000000");
    const [lineWidth, setLineWidth] = useState(15);
    const [openSessionDialog, setOpenSessionDialog] = useState(false);
    
    const wsRef = useRef();
    const scaleRef = useRef(defaultScale);
    const [drawMode, setDrawMode] = useState(true);
    const [activeTool, setActiveTool] = useState("pen");

    // Connect to session if valid session link
    useEffect(() => {
        if (id !== undefined) { // Check if id specified in link
            setSessionID(id); // Set session id and connect to session
        }
    }, [id])

    // Open dialog on mount
    useEffect(() => {
        setOpenSessionDialog(true);
        setPageCollection([{ canvasRef: createRef(), pageId: "xy123" }]);
    }, [])

    // Verify session id and try to connect to session
    useEffect(() => {
        if (sessionID !== "") {
            api.createWebsocket(sessionID, onMsgHandle, null, null,).then((socket) => {
                wsRef.current = socket;
                console.log(sessionID);
                navigator.clipboard.writeText(sessionID); // copy session ID to clipboard
            }).catch(() => console.log(`cannot connect websocket on '/${sessionID}'`));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionID])

    // Handles messages from the websocket
    function onMsgHandle(data) {
        const strokeObjectArray = JSON.parse(data.data);
        if (strokeObjectArray.length === 0) {
            actPage.deleteAll(setStrokeCollection, setHitboxCollection, setUndoStack, setRedoStack, pageCollection, setPageCollection);
        }
        else {
            let pageId = strokeObjectArray[0].pageId;
            let canvasRef = pageCollection[pageId];
            proc.processStrokes(strokeObjectArray, "message", setStrokeCollection, setHitboxCollection,
                setUndoStack, wsRef, canvasRef);
        }
    }

    function handleCreate(e) {
        let boardDim = { x: 10, y: 10 };
        api.createBoardRequest(boardDim).then((data) => {
            api.getPages(data.id).then((data) => {
                console.log(data);
                setSessionID(data.id);
                setOpenSessionDialog(false); // close dialog
            }).catch(() => console.log("server cannot get pages"));
        }).catch(() => console.log("server cannot create session"));
    }

    function handleJoin() {
        setSessionID(sidInput);
    }

    function handleTextFieldChange(e) {
        setSidInput(e.target.value);
    }

    function addPage(pageid) {
        if (wsRef.current !== undefined) { // Online
            api.addPage(sessionID);
        } else { // Offline
            actPage.addPage(pageid, setPageCollection);
        }
    }
    
    function deleteAll() {
        if (wsRef.current !== undefined) { // Online
            api.clearBoard(sessionID);
        } else { // Offline
            actPage.deleteAll(setStrokeCollection, setHitboxCollection, setUndoStack, setRedoStack, pageCollection, setPageCollection);
        }
    }

    function deletePage(pageid) {
        if (wsRef.current !== undefined) { // Online
            api.deletePage(sessionID, pageid);
        } else { // Offline
            actPage.deletePage(pageid, setStrokeCollection, setHitboxCollection, setUndoStack, setRedoStack, setPageCollection);
        }
    }

    function clearPage(pageid, canvasRef) {
        if (wsRef.current !== undefined) { // Online
            // api.clearPage(sessionID, pageid);
        } else { // Offline
            actPage.clearPage(pageid, setStrokeCollection, setHitboxCollection, setUndoStack, setRedoStack, canvasRef);
        }
    }

    function clearAll() {
        if (wsRef.current !== undefined) { // Online
            // api.clearAll(sessionID);
        } else { // Offline
            actPage.clearAll(setStrokeCollection, setHitboxCollection, setUndoStack, setRedoStack, pageCollection);
        }
    }

    function handleUndo() {
        let undo = undoStack.pop();
        if (undo !== undefined) {
            let pageId = undo[0].page_id;
            let canvasRef = actData.getCanvasRef(pageId, pageCollection);
            proc.processStrokes(undo, "undo", setStrokeCollection, setHitboxCollection,
                setRedoStack, wsRef, canvasRef);
        }
    }

    function handleRedo() {
        let redo = redoStack.pop();
        if (redo !== undefined) {
            let pageId = redo[0].page_id;
            let canvasRef = actData.getCanvasRef(pageId, pageCollection);
            proc.processStrokes(redo, "redo", setStrokeCollection, setHitboxCollection,
                setUndoStack, wsRef, canvasRef);
        }
    }

    function debug() {
        console.log(pageCollection, hitboxCollection, strokeCollection);
    }

    return (
        <div className="viewport" websocket={wsRef.current}>
            <AlertDialog open={openSessionDialog} setOpen={setOpenSessionDialog} sessionID_input={sidInput} setSessionID_input={setSidInput}
                handleTextFieldChange={handleTextFieldChange} handleJoin={handleJoin} handleCreate={handleCreate} />
            <TransformWrapper
                defaultPositionX={defaultPositionX}
                defaultPositionY={defaultPositionY}
                defaultScale={defaultScale}
                onZoomChange={(e) => { scaleRef.current = e.scale }}
                options={{
                    disabled: false,
                    minScale: 0.5,
                    maxScale: 2,
                    limitToBounds: false,
                    limitToWrapper: false,
                    centerContent: false,
                }}
                scalePadding={{
                    disabled: true
                }}
                pan={{
                    disabled: drawMode,
                    paddingSize: 0
                }}
                wheel={{
                    disabled: false,
                    wheelEnabled: true,
                    step: 200
                }}
            >
                {({ zoomIn, zoomOut, resetTransform, pan, options, positionX, positionY, setPositionX, setPositionY, setScale }) => (
                    <>
                        <Homebar
                            setOpenSessionDialog={setOpenSessionDialog}
                            addPage={addPage}
                            deleteAll={deleteAll}
                            clearAll={clearAll}
                            deletePage={deletePage}
                        />
                        <Viewbar
                            //pan={props.pan.disabled}
                            pan={pan}
                            zoomIn={zoomIn}
                            zoomOut={zoomOut}
                            resetTransform={resetTransform}
                            drawMode={drawMode} setDrawMode={setDrawMode}
                            setScale={setScale}
                            positionX={positionX}
                            positionY={positionY}
                            setPositionX={setPositionX}
                            setPositionY={setPositionY}
                        />
                        <Toolbar wsRef={wsRef}
                            debug={debug}
                            strokeStyle={strokeStyle} setStrokeStyle={setStrokeStyle}
                            lineWidth={lineWidth} setLineWidth={setLineWidth}
                            activeTool={activeTool} setActiveTool={setActiveTool}
                            handleUndo={handleUndo} 
                            handleRedo={handleRedo}
                        />
                        <TransformComponent>
                            <div className="pagecollectionouter">
                                <div className="pagecollectioninner">
                                    {pageCollection.map((page) => {
                                        return (
                                            <Whiteboard
                                                className="page"
                                                wsRef={wsRef}
                                                canvasRef={page.canvasRef}
                                                scaleRef={scaleRef}
                                                key={page.pageId}
                                                pageId={page.pageId}
                                                deletePage={deletePage}
                                                clearPage={clearPage}
                                                addPage={addPage}
                                                setDrawMode={setDrawMode}
                                                setPageCollection={setPageCollection}
                                                setStrokeCollection={setStrokeCollection}
                                                setHitboxCollection={setHitboxCollection}
                                                setUndoStack={setUndoStack}
                                                setRedoStack={setRedoStack}
                                                setActiveTool={setActiveTool}
                                                setStrokeStyle={setStrokeStyle}
                                                setLineWidth={setLineWidth}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </TransformComponent>
                    </>
                )}
            </TransformWrapper>
        </div>
    );
}

export default WhiteboardControl;

