import React, { useState, useEffect, useRef, createRef } from 'react';
import Whiteboard from './whiteboard';
import WhiteboardTools from './whiteboardtools';
import UserLogin from '../component/userlogin';
import AlertDialog from '../component/session_dialog';
import { createWebsocket, createBoardRequest } from '../util/api';
import { useParams } from 'react-router-dom';
import '../css/whiteboard.css';

import * as hd from '../util/handledata.js';
import * as draw from '../util/drawingengine.js';

function WhiteboardControl() {
    const [strokeCollection, setStrokeCollection] = useState({});
    const [hitboxCollection, setHitboxCollection] = useState({});
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const [strokeStyle, setStrokeStyle] = useState("#000000");
    const [lineWidth, setLineWidth] = useState(3);
    const [needsClear, setNeedsClear] = useState(0);
    const [needsRedraw, setNeedsRedraw] = useState(0);
    const [needsHitboxDebug, setNeedsHitboxDebug] = useState(0);
    const [openSessionDialog, setOpenSessionDialog] = useState(false);
    const [openAccDialog, setOpenAccDialog] = useState(false);
    const [sessionID, setSessionID] = useState("");
    const [sidInput, setSidInput] = useState("");
    const wsRef = useRef();
    const canvasRef = useRef();
    const { id } = useParams();

    // Connect to session if valid session link
    useEffect(() => {
        if (id !== undefined) { // Check if id specified in link
            setSessionID(id); // Set session id and connect to session
        }
    }, [id])

    // Open dialog on mount
    // useEffect(() => {
    //     setOpen(true);
    // }, [])

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
    }, [lineWidth, strokeStyle])

    // Clear canvas and all collections / stacks
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas !== undefined) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, window.innerHeight, window.innerWidth);
            setStrokeCollection({});
            setHitboxCollection({});
            setUndoStack([]);
            setRedoStack([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [needsClear])

    // redraws full strokeCollection
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas !== undefined) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, window.innerHeight, window.innerWidth);
            Object.keys(strokeCollection).forEach((key) => {
                let strokeObject = strokeCollection[key];
                return draw.drawCurve(ctx, strokeObject);
            })
            setContextProps();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [needsRedraw])

    // Handles messages from the websocket
    function onMsgHandle(data) {
        const strokeObjectArray = JSON.parse(data.data);
        if (strokeObjectArray.length === 0) {
            setNeedsClear(x => x + 1);
        }
        else {
            hd.processStrokes(strokeObjectArray, "message", setStrokeCollection, setHitboxCollection,
                setUndoStack, setNeedsRedraw, wsRef, canvasRef);
            setContextProps();
        }
    }

    function setContextProps() {
        for (let i = 0; i < whiteboardArray.length; i++) {
            const canvas = whiteboardArray[i].canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = lineWidth;
        }
    }

    const [whiteboardArray, setWhiteboardArray] = useState(
        [
            { canvasRef: createRef(), strokeCollection: strokeCollection[0], id: 1 },
            { canvasRef: createRef(), strokeCollection: strokeCollection[1], id: 2 },
            { canvasRef: createRef(), strokeCollection: strokeCollection[2], id: 3 },
            { canvasRef: createRef(), strokeCollection: strokeCollection[3], id: 4 }
        ]
    );

    const pages = whiteboardArray.map((board, index) => {
        return (
            <Whiteboard
                index={index}
                wsRef={wsRef}
                canvasRef={board.canvasRef}
                pageId={board.id}
                setStrokeCollection={setStrokeCollection}
                setHitboxCollection={setHitboxCollection}
                setNeedsRedraw={setNeedsRedraw}
                setUndoStack={setUndoStack}
                setRedoStack={setRedoStack}
            />
        );
    });

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

    /////////////////////////////////
    // DEBUG: draws hitboxCollection
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas !== undefined) {
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = "#00FF00";
            ctx.clearRect(0, 0, window.innerHeight, window.innerWidth);
            Object.keys(hitboxCollection).forEach((key) => {
                let xy = JSON.parse("[" + key + "]");
                return draw.drawFillRect(xy[0], xy[1], 1, 1, ctx);
            })
            setContextProps();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [needsHitboxDebug])
    /////////////////////////////////

    return (
        <div>
            <UserLogin openAccDialog={openAccDialog} setOpenAccDialog={setOpenAccDialog} />
            <AlertDialog open={openSessionDialog} setOpen={setOpenSessionDialog} sessionID_input={sidInput} setSessionID_input={setSidInput}
                handleTextFieldChange={handleTextFieldChange} handleJoin={handleJoin} handleCreate={handleCreate} />
            <WhiteboardTools wsRef={wsRef} canvasRef={canvasRef}
                strokeStyle={strokeStyle} setStrokeStyle={setStrokeStyle}
                strokeCollection={strokeCollection} setStrokeCollection={setStrokeCollection}
                lineWidth={lineWidth} setLineWidth={setLineWidth}
                sessionID={sessionID}
                setOpenSessionDialog={setOpenSessionDialog}
                setOpenAccDialog={setOpenAccDialog}
                setNeedsClear={setNeedsClear}
                setHitboxCollection={setHitboxCollection}
                setNeedsRedraw={setNeedsRedraw}
                undoStack={undoStack} setUndoStack={setUndoStack}
                redoStack={redoStack} setRedoStack={setRedoStack}
                setNeedsHitboxDebug={setNeedsHitboxDebug}
                setWhiteboardArray={setWhiteboardArray} />
            <div className="canvasdiv" websocket={wsRef.current}>
                {pages}
            </div>
        </div>
    );
}

export default WhiteboardControl;

