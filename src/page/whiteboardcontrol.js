import React, {useState, useEffect, useRef} from 'react';
import { Container } from '@material-ui/core';
import Whiteboard from './whiteboard';
import WhiteboardTools from './whiteboardtools';

import AlertDialog from '../component/session_dialog';
import {createWebsocket, createBoardRequest} from '../core/api';
import { useParams } from 'react-router-dom';

function WhiteboardControl() {
    const [strokeCollection, setStrokeCollection] = useState([]);
    const [strokeStyle, setStrokeStyle] = useState("#000000");
    const [lineWidth, setLineWidth] = useState(3);

    const [changeCounter, setChangeCounter] = useState(0);
    const [open, setOpen] = useState(true);
    const [sessionID, setSessionID] = useState("");
    const [sidInput, setSidInput] = useState("");
    const wsRef = useRef(null);

    // Connect to session if valid session link
    const { id } = useParams();
    useEffect(()=>{
        if(id !== undefined){ // Check if id specified in link
            setSessionID(id); // Set session id and connect to session
        }
    },[id])

    // Open dialog on mount
    useEffect(() => {
        setOpen(true);
    },[])

    // Verify session id and try to connect to session
    useEffect(() => {
        if (sessionID !== ""){
            createWebsocket(sessionID, onMsgHandle, 
                null, null).then((socket) => wsRef.current = socket).catch(() => console.log(`cannot connect websocket on '/${sessionID}'`))
            console.log(sessionID);
            navigator.clipboard.writeText(sessionID); // copy session ID to clipboard
            setOpen(false); // close dialog
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[sessionID])

    // Handles messages from the websocket
    function onMsgHandle(data) {
        // setChangeCounter((changeCounter) => changeCounter + 1);
        // listen to data sent from the websocket server
        const message = JSON.parse(data.data);
        console.log(message);
        // TODO: message handling
        // setStrokeCollection((prev) => {
        //     message.forEach((loc) => {
                
        //     })
        //     return [...prev];
        // });
    }

    function handleCreate(e) {
        let boardDim = {x: 10, y: 10};
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
        <Container id="container" maxWidth="lg">
            <AlertDialog open={open} setOpen={setOpen} sessionID_input={sidInput} setSessionID_input={setSidInput}
            handleTextFieldChange={handleTextFieldChange} handleJoin={handleJoin} handleCreate={handleCreate} />
            <div className="whiteboard">
                <h1>WhiteBOIrd</h1>
                <p>
                    This rad website is going to take over the internet
                    with PogChamp functionalities and sonic speed nasa performance XDXD.
                    </p>

                <div className="whiteboardsection">
                    <Whiteboard wsRef={wsRef} strokeCollection={strokeCollection} setStrokeCollection={setStrokeCollection}
                        strokeStyle={strokeStyle} lineWidth={lineWidth} />
                    <WhiteboardTools strokeStyle={strokeStyle} setStrokeStyle={setStrokeStyle}
                        strokeCollection={strokeCollection} setStrokeCollection={setStrokeCollection} />
                </div>
            </div>
        </Container>
    );
}

export default WhiteboardControl;