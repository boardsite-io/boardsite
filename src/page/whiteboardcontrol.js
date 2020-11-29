import React, { useState, useEffect, useRef, createRef } from 'react';
import Whiteboard from './whiteboard';
import WhiteboardTools from './whiteboardtools';
import UserLogin from '../component/userlogin';
import AlertDialog from '../component/session_dialog';
import { createWebsocket, createBoardRequest } from '../util/api';
import { useParams } from 'react-router-dom';

import * as hd from '../util/handledata.js';

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
        setPageCollection([{canvasRef: createRef(), pageId: "xy123"}]);
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

    const pages = pageCollection.map((page) => {
        return (
            <Whiteboard
                className="page"
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
    });

    return (
        <div>
            <UserLogin openAccDialog={openAccDialog} setOpenAccDialog={setOpenAccDialog} />
            <AlertDialog open={openSessionDialog} setOpen={setOpenSessionDialog} sessionID_input={sidInput} setSessionID_input={setSidInput}
                handleTextFieldChange={handleTextFieldChange} handleJoin={handleJoin} handleCreate={handleCreate} />
            <WhiteboardTools wsRef={wsRef}
                strokeStyle={strokeStyle} setStrokeStyle={setStrokeStyle}
                strokeCollection={strokeCollection} setStrokeCollection={setStrokeCollection}
                lineWidth={lineWidth} setLineWidth={setLineWidth}
                sessionID={sessionID}
                setOpenSessionDialog={setOpenSessionDialog}
                setOpenAccDialog={setOpenAccDialog}
                setNeedsClear={setNeedsClear}
                hitboxCollection={hitboxCollection} setHitboxCollection={setHitboxCollection}
                undoStack={undoStack} setUndoStack={setUndoStack}
                redoStack={redoStack} setRedoStack={setRedoStack}
                pageCollection={pageCollection} setPageCollection={setPageCollection} />
            <div className="pagecollection" websocket={wsRef.current}>
                {pages}
            </div>
        </div>
    );
}

export default WhiteboardControl;

