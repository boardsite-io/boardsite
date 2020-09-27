import React, { useState } from 'react';
import { Container } from '@material-ui/core';

import Canvas from './canvas';
import CanvasTools from './canvastools';

function CanvasControl() {
    const [currColor, setCurrColor] = useState("#000000");
    const [locations, setLocations] = useState(() => []);

    return (
        <Container id="container" maxWidth="lg">
            <h1>Home</h1>
            <div className="homediv">
                <Canvas currColor={currColor} locations={locations} setLocations={setLocations}/>
                <CanvasTools currColor={currColor} setCurrColor={setCurrColor} setLocations={setLocations}/>
            </div>
        </Container>
    );
}

export default CanvasControl;