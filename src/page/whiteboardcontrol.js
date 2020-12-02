import React, { useState, useEffect, useRef, createRef } from 'react';
import Whiteboard from './whiteboard';
import Toolbar from './toolbar';
import Homebar from './homebar';
import Viewbar from './viewbar';
import UserLogin from '../component/userlogin';
import AlertDialog from '../component/session_dialog';
import { createWebsocket, createBoardRequest } from '../util/api';
import { useParams } from 'react-router-dom';
import * as hd from '../util/handledata.js';
import * as pg from '../util/pageactions.js';

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

function WhiteboardControl() {
    const [pageCollection, setPageCollection] = useState([]);
    const [strokeCollection, setStrokeCollection] = useState({});
    const [hitboxCollection, setHitboxCollection] = useState({});
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const [strokeStyle, setStrokeStyle] = useState("#000000");
    const [lineWidth, setLineWidth] = useState(3);
    const [needsClear, setNeedsClear] = useState(0);
    const [openSessionDialog, setOpenSessionDialog] = useState(false);
    const [openAccDialog, setOpenAccDialog] = useState(false);
    const [sessionID, setSessionID] = useState("");
    const [sidInput, setSidInput] = useState("");
    const wsRef = useRef();
    const { id } = useParams();
    const scaleRef = useRef(1);
    const isDrawModeRef = useRef(true);

    // Connect to session if valid session link
    useEffect(() => {
        if (id !== undefined) { // Check if id specified in link
            setSessionID(id); // Set session id and connect to session
        }
    }, [id])

    // Open dialog on mount
    useEffect(() => {
        // setOpenSessionDialog(true);
        setPageCollection([{ canvasRef: createRef(), pageId: "xy123" }]);
    }, [])

    // Verify session id and try to connect to session
    useEffect(() => {
        if (sessionID !== "") {
            createWebsocket(sessionID, onMsgHandle, null, null,).then((socket) => {
                wsRef.current = socket;
                console.log(sessionID);
                navigator.clipboard.writeText(sessionID); // copy session ID to clipboard
            }).catch(() => console.log(`cannot connect websocket on '/${sessionID}'`));
            setOpenSessionDialog(false); // close dialog
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionID])

    // Update stroke attributes in context when their props change
    useEffect(() => {
        setContextProps();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lineWidth, strokeStyle, pageCollection])

    // Clear all canvases and all collections / stacks
    useEffect(() => {
        pg.clearAll(setStrokeCollection, setHitboxCollection, setUndoStack, setRedoStack, pageCollection, setPageCollection);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [needsClear])

    function setContextProps() {
        pageCollection.forEach((page) => {
            const canvas = page.canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = lineWidth;
        });
    }

    // Handles messages from the websocket
    function onMsgHandle(data) {
        const strokeObjectArray = JSON.parse(data.data);
        if (strokeObjectArray.length === 0) {
            pg.clearAll(setStrokeCollection, setHitboxCollection, setUndoStack, setRedoStack, pageCollection, setPageCollection);
        }
        else {
            let pageId = strokeObjectArray[0].pageId;
            let canvasRef = pageCollection[pageId];
            hd.processStrokes(strokeObjectArray, "message", setStrokeCollection, setHitboxCollection,
                setUndoStack, wsRef, canvasRef);
            setContextProps();
        }
    }

    function handleCreate(e) {
        let boardDim = { x: 10, y: 10 };
        createBoardRequest(boardDim).then((data) => {
            setSessionID(data.id);
        }).catch(() => console.log("server cannot create session"));
    }

    function handleJoin() {
        setSessionID(sidInput);
    }

    function handleTextFieldChange(e) {
        setSidInput(e.target.value);
    }

    function deletePage(pageId) {
        pg.deletePage(pageId, setStrokeCollection, setHitboxCollection, setUndoStack, setRedoStack, pageCollection, setPageCollection);
    }

    return (
        <div className="viewport">
            <UserLogin openAccDialog={openAccDialog} setOpenAccDialog={setOpenAccDialog} />
            <AlertDialog open={openSessionDialog} setOpen={setOpenSessionDialog} sessionID_input={sidInput} setSessionID_input={setSidInput}
                handleTextFieldChange={handleTextFieldChange} handleJoin={handleJoin} handleCreate={handleCreate} />
            <div className="pagewrapper" websocket={wsRef.current}>
                <TransformWrapper
                    defaultScale={1}
                    onZoomChange={(e) => { scaleRef.current = e.scale }}
                    options={{
                        disabled: false,
                        minScale: 0.5,
                        maxScale: 2,
                        limitToBounds: false,
                        limitToWrapper: false,
                        centerContent: true
                    }}
                    scalePadding={{
                        disabled: true
                    }}
                    pan={{
                        disabled: isDrawModeRef.current,
                        paddingSize: 40
                    }}
                    wheel={{
                        disabled: false,
                        wheelEnabled: true,
                        step: 200
                    }}
                >
                    {({ zoomIn, zoomOut, resetTransform, pan, options, positionX, positionY, setPositionX, setPositionY }) => (
                        <>
                            <Homebar
                                setOpenSessionDialog={setOpenSessionDialog}
                                setOpenAccDialog={setOpenAccDialog}
                            />
                            <Viewbar
                                pan={pan}
                                zoomIn={zoomIn}
                                zoomOut={zoomOut}
                                resetTransform={resetTransform}
                                isDrawModeRef={isDrawModeRef}
                                // positionX={positionX}
                                positionY={positionY}
                                // setPositionX={setPositionX}
                                setPositionY={setPositionY}
                            />
                            <Toolbar wsRef={wsRef}
                                strokeStyle={strokeStyle} setStrokeStyle={setStrokeStyle}
                                strokeCollection={strokeCollection} setStrokeCollection={setStrokeCollection}
                                lineWidth={lineWidth} setLineWidth={setLineWidth}
                                sessionID={sessionID}
                                setNeedsClear={setNeedsClear}
                                hitboxCollection={hitboxCollection} setHitboxCollection={setHitboxCollection}
                                undoStack={undoStack} setUndoStack={setUndoStack}
                                redoStack={redoStack} setRedoStack={setRedoStack}
                                pageCollection={pageCollection} setPageCollection={setPageCollection}
                            />
                            <TransformComponent>
                                <div className="pagecollectionouter">
                                    <div className="pagecollectionmiddle">
                                        <div className="pagecollectioninner">
                                            {pageCollection.map((page) => {
                                                return (
                                                    <Whiteboard
                                                        isDrawModeRef={isDrawModeRef}
                                                        className="page"
                                                        scaleRef={scaleRef}
                                                        key={page.pageId}
                                                        pageId={page.pageId}
                                                        deletePage={deletePage}
                                                        canvasRef={page.canvasRef}
                                                        wsRef={wsRef}
                                                        setPageCollection={setPageCollection}
                                                        setStrokeCollection={setStrokeCollection}
                                                        setHitboxCollection={setHitboxCollection}
                                                        setUndoStack={setUndoStack}
                                                        setRedoStack={setRedoStack}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </TransformComponent>
                        </>
                    )}
                </TransformWrapper>
            </div>
        </div >
    );
}

export default WhiteboardControl;

