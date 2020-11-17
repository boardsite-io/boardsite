import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        setOpen(true);
    },[])

    function onMsgHandle() {

    }

    function handleCreate(e) {
        let boardDim = {x: 5, y: 5};
        createBoardRequest(boardDim).then((data) => {
            setSessionID(data.id);
        }).catch(() => console.log("FEHLER"));
    }

    function handleJoin(e) {
        createWebsocket(sessionID, onMsgHandle, 
            null, null).then((socket) => console.log("FIXME XD"))
        console.log(sessionID);
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
                        blockSize={blockSize} setBlockSize={setBlockSize}/>
                <CanvasTools currColor={currColor} setCurrColor={setCurrColor} locations={locations} setLocations={setLocations}/>
            </div>
        </Container>
    );
}

export default CanvasControl;