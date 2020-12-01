import React, { useState, useEffect, useRef, createRef } from 'react';
import Whiteboard from './whiteboard';
import Toolbar from './toolbar';
import Homebar from './homebar';
import Viewbar from './viewbar';
import UserLogin from '../component/userlogin';
import AlertDialog from '../component/session_dialog';
import { createWebsocket, createBoardRequest } from '../util/api';
import { useParams } from 'react-router-dom';
import theme from '../component/theme';
import * as hd from '../util/handledata.js';

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
        pageCollection.forEach((page) => {
            const canvas = page.canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, window.innerHeight, window.innerWidth);
            setStrokeCollection({});
            setHitboxCollection({});
            setUndoStack([]);
            setRedoStack([]);
            setPageCollection([]);
        });
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
            setNeedsClear(x => x + 1);
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
        if (pageCollection.length === 1) {
            setNeedsClear(x => x + 1);
            return;
        }

        // Delete strokeCollection from page
        setStrokeCollection((prev) => {
            delete prev[pageId]
            return prev;
        })

        // Delete hitboxCollection from page
        setHitboxCollection((prev) => {
            delete prev[pageId]
            return prev;
        })

        setUndoStack((prev) => {
            let newPrev = [];
            prev.forEach((actionArray, index) => {
                let action = actionArray[0];
                if (action.page_id !== pageId) {
                    newPrev.push(prev[index]);
                }
            })
            return newPrev;
        })

        setRedoStack((prev) => {
            let newPrev = [];
            prev.forEach((actionArray, index) => {
                let action = actionArray[0];
                if (action.page_id !== pageId) {
                    newPrev.push(prev[index]);
                }
            })
            return newPrev;
        })

        // Find page index from id
        pageCollection.forEach((page, index) => {
            if (page.pageId === pageId) {
                // Delete page from pageCollection
                deletePageFromCollection(index);
                return;
            }
        })

        function deletePageFromCollection(index) {
            setPageCollection((prev) => {
                return [...prev.slice(0, index), ...prev.slice(index + 1)];
            })
        }
    }

    // SCALE REF
    const scaleRef = useRef(1);
    const isDrawModeRef = useRef(true);
    function zoomChange(zoomObject) {
        scaleRef.current = zoomObject.scale;
    }

    return (
        <div className="viewport">
            <UserLogin openAccDialog={openAccDialog} setOpenAccDialog={setOpenAccDialog} />
            <AlertDialog open={openSessionDialog} setOpen={setOpenSessionDialog} sessionID_input={sidInput} setSessionID_input={setSidInput}
                handleTextFieldChange={handleTextFieldChange} handleJoin={handleJoin} handleCreate={handleCreate} />
            <div className="pagewrapper" websocket={wsRef.current}>
                <TransformWrapper
                    defaultScale={1}
                    onZoomChange={zoomChange}
                    options={{ 
                        disabled: isDrawModeRef.current, 
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
                        disabled: false, 
                        paddingSize: 40 
                    }}
                    wheel={{ 
                        disabled: false, 
                        wheelEnabled: true, 
                        step: 200 
                    }}
                >
                    {({ zoomIn, zoomOut, resetTransform, setScale, scale, options, positionX, positionY, setPositionX, setPositionY }) => (
                        <>
                            <Homebar
                                setOpenSessionDialog={setOpenSessionDialog}
                                setOpenAccDialog={setOpenAccDialog}
                            />
                            <Viewbar
                                zoomIn={zoomIn}
                                zoomOut={zoomOut}
                                resetTransform={resetTransform}
                                options={options}
                                isDrawModeRef={isDrawModeRef}
                                // positionX={positionX}
                                // positionY={positionY}
                                // setPositionX={setPositionX}
                                // setPositionY={setPositionY}
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
                                    <div className="pagecollection" style={{ backgroundColor: theme.palette.background.pagecollection }}>
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
                            </TransformComponent>
                        </>
                    )}
                </TransformWrapper>
            </div>
        </div >
    );
}

export default WhiteboardControl;

