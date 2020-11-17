import React from 'react';
import { Route } from 'react-router-dom';

import CanvasControl from '../page/canvascontrol';
import WhiteboardControl from '../page/whiteboardcontrol';
import About from '../page/about';
import Account from '../page/account';
import HomePage from '../page/homepage';

export default (
    <Route>
        <Route path="/" exact component={HomePage} />
        <Route path="/blocks/:id" exact component={CanvasControl} />
        <Route path="/whiteboard" component={WhiteboardControl} />
        <Route path="/about" component={About} />
        <Route path="/account" component={Account} />
    </Route>
);
