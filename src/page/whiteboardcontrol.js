import React, { useState, useEffect, useRef } from 'react';
import Whiteboard from './whiteboard';
import WhiteboardTools from './whiteboardtools';

import AlertDialog from '../component/session_dialog';
import { createWebsocket, createBoardRequest } from '../util/api';
import { useParams } from 'react-router-dom';
import '../css/whiteboard.css';

function WhiteboardControl() {
    const [strokeCollection, setStrokeCollection] = useState({});
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const [hitboxCollection, setHitboxCollection] = useState({});
    const [strokeMessage, setStrokeMessage] = useState({});
    const [strokeStyle, setStrokeStyle] = useState("#000000");
    const [lineWidth, setLineWidth] = useState(3);
    const [needsClear, setNeedsClear] = useState(0);
    const [needsRedraw, setNeedsRedraw] = useState(0);
    const [needsHitboxDebug, setNeedsHitboxDebug] = useState(0);
    const canvasRef = useRef();


    const [open, setOpen] = useState(false);
    const [sessionID, setSessionID] = useState("");
    const [sidInput, setSidInput] = useState("");
    const wsRef = useRef(null);

    // Connect to session if valid session link
    const { id } = useParams();
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
            createWebsocket(
                sessionID,
                onMsgHandle,
                null,
                null,
            ).then((socket) => {
                wsRef.current = socket;
                console.log(sessionID);
                navigator.clipboard.writeText(sessionID); // copy session ID to clipboard
            }
            ).catch(() => console.log(`cannot connect websocket on '/${sessionID}'`))

            setOpen(false); // close dialog
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionID])

    // Handles messages from the websocket
    function onMsgHandle(data) {
        // listen to data sent from the websocket server
        const message = JSON.parse(data.data);
        if (message.length === 0) {
            setNeedsClear(x => x + 1);
        }
        else {
            let msg = {};
            message.forEach((stroke) => {
                msg[stroke.id] = stroke
            });
            setStrokeMessage(msg);
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

    return (
        <div>
            <AlertDialog open={open} setOpen={setOpen} sessionID_input={sidInput} setSessionID_input={setSidInput}
                handleTextFieldChange={handleTextFieldChange} handleJoin={handleJoin} handleCreate={handleCreate} />
            <Whiteboard wsRef={wsRef} canvasRef={canvasRef}
                strokeCollection={strokeCollection} setStrokeCollection={setStrokeCollection}
                hitboxCollection={hitboxCollection} setHitboxCollection={setHitboxCollection}
                strokeStyle={strokeStyle} lineWidth={lineWidth} needsClear={needsClear} setNeedsClear={setNeedsClear}
                strokeMessage={strokeMessage} setStrokeMessage={setStrokeMessage}
                needsRedraw={needsRedraw} setNeedsRedraw={setNeedsRedraw}
                undoStack={undoStack} setUndoStack={setUndoStack}
                redoStack={redoStack} setRedoStack={setRedoStack}
                needsHitboxDebug={needsHitboxDebug} />
            <WhiteboardTools wsRef={wsRef} canvasRef={canvasRef}
                strokeStyle={strokeStyle} setStrokeStyle={setStrokeStyle}
                strokeCollection={strokeCollection} setStrokeCollection={setStrokeCollection}
                lineWidth={lineWidth} setLineWidth={setLineWidth} sessionID={sessionID}
                setOpen={setOpen} setNeedsClear={setNeedsClear} setHitboxCollection={setHitboxCollection}
                setStrokeMessage={setStrokeMessage}
                setNeedsRedraw={setNeedsRedraw}
                undoStack={undoStack} setUndoStack={setUndoStack}
                redoStack={redoStack} setRedoStack={setRedoStack}
                setNeedsHitboxDebug={setNeedsHitboxDebug} />
        </div>
    );
}

export default WhiteboardControl;