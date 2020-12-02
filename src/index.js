import React from 'react';
import ReactDOM from 'react-dom';

import './css/theme.css';
import './css/index.css';
import './css/whiteboard.css';
import './css/toolbar.css';
import './css/buttons.css';
import './css/homebar.css';
import './css/viewbar.css';
import './css/popup.css';

import routes from './component/route';
import { BrowserRouter as Router } from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';

class Boardsite extends React.Component {
    render() {
        return (
            <div className="rootdiv">
                <CssBaseline />
                <Router>
                    {routes}
                </Router>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Boardsite />,
    document.getElementById('root')
);
