import React from 'react';
import { Route } from 'react-router-dom';

import WhiteboardControl from '../page/whiteboardcontrol';
import About from '../page/about';
import Account from '../page/account';

export default (
    <Route>
        <Route path="/" exact component={WhiteboardControl} />
        {/* <Route path="/blocks/:id" exact component={WhiteboardControl} /> */}
        <Route exact path="/create"> <WhiteboardControl /> </Route>
        <Route path="/about" component={About} />
        <Route path="/account" component={Account} />
    </Route>
);
