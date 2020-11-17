import React, { useState, useEffect, useRef } from 'react';
import { Container } from '@material-ui/core';

import Canvas from './canvas';
import CanvasTools from './canvastools';
import AlertDialog from '../component/session_dialog';

import {createWebsocket, createBoardRequest, sendRequest} from '../core/api';

function CanvasControl() {
    const [currColor, setCurrColor] = useState("#000000");
    const [locations, setLocations] = useState([]);
    const [blockSize, setBlockSize] = useState(50);
    const [blocksPerDim, setBlocksPerDim] = useState(10);
    const [changeCounter, setChangeCounter] = useState(0);

    const [open, setOpen] = React.useState(true);
    const [sessionID, setSessionID] = useState("");

    const wsRef = useRef(null);

    useEffect(() => {
        setOpen(true);
    },[])

    function onMsgHandle(data) {
        setChangeCounter((changeCounter) => changeCounter + 1);
        // listen to data sent from the websocket server
        const message = JSON.parse(data.data);

        let tmp = locations;
        message.forEach(location => {
            //console.log(location);
            let index = blocksPerDim * location.y + location.x
            tmp[index] = { color: location.color };
        })
        setLocations(tmp);
        // TODO: ASYNC LOCATIONS
    }

    function handleCreate(e) {
        let boardDim = {x: 10, y: 10};
        createBoardRequest(boardDim).then((data) => {
            setSessionID(data.id,() => handleJoin() )
        }).catch(() => console.log("FEHLER"));
    }

    function handleJoin() {
        createWebsocket(sessionID, onMsgHandle, 
            null, null).then((socket) => wsRef.current = socket).catch(() => console.log("ALARM!"))
        console.log(sessionID);
        setOpen(false);
    }

    function handleTextFieldChange(e) {
        setSessionID(e.target.value);
    }

    return (
        <Container id="container" maxWidth="lg">
            <AlertDialog open={open} setOpen={setOpen} sessionID={sessionID} setSessionID={setSessionID}
            handleTextFieldChange={handleTextFieldChange} handleJoin={handleJoin} handleCreate={handleCreate} />
            <h1>Home</h1>
            <div className="homediv">
                <Canvas changeCounter={changeCounter} setChangeCounter={setChangeCounter} currColor={currColor} 
                        locations={locations} setLocations={setLocations} blocksPerDim={blocksPerDim} setBlocksPerDim={setBlocksPerDim}
                        blockSize={blockSize} setBlockSize={setBlockSize} 
                        wsRef={wsRef}/>
                <CanvasTools currColor={currColor} setCurrColor={setCurrColor} locations={locations} setLocations={setLocations}/>
            </div>
        </Container>
    );
}

export default CanvasControl;