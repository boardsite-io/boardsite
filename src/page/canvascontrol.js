import React, { useState } from 'react';
import { Container } from '@material-ui/core';

import Canvas from './canvas';
import CanvasTools from './canvastools';

function CanvasControl() {
    const [currColor, setCurrColor] = useState("#000000");
    const [locations, setLocations] = useState([]);
    const [changeCounter, setChangeCounter] = useState(0);

    return (
        <Container id="container" maxWidth="lg">
            <h1>Home</h1>
            <div className="homediv">
                <Canvas changeCounter={changeCounter} setChangeCounter={setChangeCounter} currColor={currColor} locations={locations} setLocations={setLocations}/>
                <CanvasTools currColor={currColor} setCurrColor={setCurrColor} locations={locations} setLocations={setLocations}/>
            </div>
        </Container>
    );
}

export default CanvasControl;