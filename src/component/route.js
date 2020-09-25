import React from 'react';
import { Route } from 'react-router-dom';

import Home from '../page/home';
import Whiteboard from '../page/whiteboard';
import About from '../page/about';
import Account from '../page/account'

export default (
    <Route>
        <Route path="/" exact component={Home} />
        <Route path="/whiteboard" component={Whiteboard} />
        <Route path="/about" component={About} />
        <Route path="/account" component={Account} />
    </Route>
);
