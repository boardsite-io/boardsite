import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Navigation from './navigation';
import Home from './home';
import Whiteboard from './whiteboard';
import About from './about';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

class Boardsite extends React.Component {
    render() {
        return (
            <div className="boardsite">
                <head>
                    <title>BoardSite</title>
                </head>

                <Router>
                <Navigation />
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/whiteboard" component={Whiteboard} />
                    <Route path="/about" component={About} />
                </Switch>
                </Router>

                <footer>
                    Certified Footer 4Head
                </footer>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Boardsite />,
    document.getElementById('root')
);
