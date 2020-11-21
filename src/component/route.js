import React from 'react';
import { Route } from 'react-router-dom';

import WhiteboardControl from '../page/whiteboardcontrol';
import About from '../page/about';
import Account from '../page/account';

export default (
    <Route>
        <Route exact path="/" component={WhiteboardControl} />
        <Route exact path="/s=:id" component={WhiteboardControl}/>
        <Route exact path="/about" component={About} />
        <Route exact path="/account" component={Account} />
    </Route>
);
