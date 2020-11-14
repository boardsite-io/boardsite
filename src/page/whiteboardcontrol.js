import React from 'react';
import { Container } from '@material-ui/core';
import Whiteboard from './whiteboard';

function WhiteboardControl() {
    return (
        <Container id="container" maxWidth="lg">
            <div className="whiteboard">
                <body>
                    <h1>WhiteBOIrd</h1>
                    <p>
                        This rad website is going to take over the internet
                        with PogChamp functionalities and sonic speed nasa performance XDXD.
                    </p>
                    <Whiteboard />
                </body>
            </div>
        </Container>
    );
}

export default WhiteboardControl;