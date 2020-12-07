import React, { useState, useEffect, useRef, createRef } from 'react';
import Whiteboard from './whiteboard';
import Toolbar from './toolbar';
import Homebar from './homebar';
import Viewbar from './viewbar';
import AlertDialog from '../component/session_dialog';
import { useParams } from 'react-router-dom';
import * as api from '../util/api';
import * as hd from '../util/handledata.js';
import * as pg from '../util/pageactions.js';

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
    const [lineWidth, setLineWidth] = useState(3);
    const [openSessionDialog, setOpenSessionDialog] = useState(false);
    
    const wsRef = useRef();
    const scaleRef = useRef(defaultScale);
    const isDrawModeRef = useRef(true);

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

    // Update stroke attributes in context when their props change
    useEffect(() => {
        setContextProps();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lineWidth, strokeStyle, pageCollection])

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

    /** Function for adding pages
     * 
     * @param {optional param - leave empty for appending pages} pageid 
     */
    function addPage(pageid) {
        if (wsRef.current !== undefined) { // Online
            api.addPage(sessionID);
        } else { // Offline
            pg.addPage(pageid, setPageCollection);
        }
    }
    
    function clearAll() {
        if (wsRef.current !== undefined) { // Online
            api.clearBoard(sessionID);
        } else { // Offline
            pg.clearAll(setStrokeCollection, setHitboxCollection, setUndoStack, setRedoStack, pageCollection, setPageCollection);
        }
    }

    function deletePage(pageid) {
        if (wsRef.current !== undefined) { // Online
            api.deletePage(sessionID, pageid);
        } else { // Offline
            pg.deletePage(pageid, setStrokeCollection, setHitboxCollection, setUndoStack, setRedoStack, pageCollection, setPageCollection);
        }
    }

    function clearPage(pageid) {

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
                    disabled: isDrawModeRef.current,
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
                        />
                        <Viewbar
                            pan={pan}
                            zoomIn={zoomIn}
                            zoomOut={zoomOut}
                            resetTransform={resetTransform}
                            isDrawModeRef={isDrawModeRef}
                            setScale={setScale}
                            positionX={positionX}
                            positionY={positionY}
                            setPositionX={setPositionX}
                            setPositionY={setPositionY}
                        />
                        <Toolbar wsRef={wsRef}
                            strokeStyle={strokeStyle} setStrokeStyle={setStrokeStyle}
                            strokeCollection={strokeCollection} setStrokeCollection={setStrokeCollection}
                            lineWidth={lineWidth} setLineWidth={setLineWidth}
                            sessionID={sessionID}
                            addPage={addPage}
                            clearAll={clearAll}
                            hitboxCollection={hitboxCollection} setHitboxCollection={setHitboxCollection}
                            undoStack={undoStack} setUndoStack={setUndoStack}
                            redoStack={redoStack} setRedoStack={setRedoStack}
                            pageCollection={pageCollection} setPageCollection={setPageCollection}
                        />
                        <TransformComponent>
                            <div className="pagecollectionouter">
                                <div className="pagecollectioninner">
                                    {pageCollection.map((page) => {
                                        return (
                                            <Whiteboard
                                                className="page"
                                                wsRef={wsRef}
                                                isDrawModeRef={isDrawModeRef}
                                                canvasRef={page.canvasRef}
                                                scaleRef={scaleRef}
                                                key={page.pageId}
                                                pageId={page.pageId}
                                                deletePage={deletePage}
                                                clearPage={clearPage}
                                                addPage={addPage}
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
                        </TransformComponent>
                    </>
                )}
            </TransformWrapper>
        </div>
    );
}

export default WhiteboardControl;

