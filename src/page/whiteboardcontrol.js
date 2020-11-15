import React, {useState} from 'react';
import { Container } from '@material-ui/core';
import Whiteboard from './whiteboard';
import WhiteboardTools from './whiteboardtools';

function WhiteboardControl() {
    const [strokeCollection, setStrokeCollection] = useState([]);
    const [currColor, setCurrColor] = useState("#000000");
    const [currWidth, setCurrWidth] = useState(10);

    return (
        <Container id="container" maxWidth="lg">
            <div className="whiteboard">
                <body>
                    <h1>WhiteBOIrd</h1>
                    <p>
                        This rad website is going to take over the internet
                        with PogChamp functionalities and sonic speed nasa performance XDXD.
                    </p>

                    <div className="whiteboardsection">
                        <Whiteboard strokeCollection={strokeCollection} setStrokeCollection={setStrokeCollection}
                        currColor={currColor} currWidth={currWidth}/>
                        <WhiteboardTools currColor={currColor} setCurrColor={setCurrColor} strokeCollection={strokeCollection} setStrokeCollection={setStrokeCollection}/>
                    </div>
                    
                </body>
            </div>
        </Container>
    );
}

export default WhiteboardControl;