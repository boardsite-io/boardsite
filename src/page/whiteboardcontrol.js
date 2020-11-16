import React, {useState} from 'react';
import { Container } from '@material-ui/core';
import Whiteboard from './whiteboard';
import WhiteboardTools from './whiteboardtools';

function WhiteboardControl() {
    const [strokeCollection, setStrokeCollection] = useState([]);
    const [strokeStyle, setStrokeStyle] = useState("#000000");
    const [lineWidth, setLineWidth] = useState(3);

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
                        strokeStyle={strokeStyle} lineWidth={lineWidth}/>
                        <WhiteboardTools strokeStyle={strokeStyle} setStrokeStyle={setStrokeStyle}
                        strokeCollection={strokeCollection} setStrokeCollection={setStrokeCollection}/>
                    </div>
                </body>
            </div>
        </Container>
    );
}

export default WhiteboardControl;