import React from 'react';
import ReactDOM from 'react-dom';

import './css/index.css';
import './css/whiteboard.css';
import './css/toolbar.css';
import './css/buttons.css';
import './css/homebar.css';
import './css/viewbar.css';

import theme from './component/theme';
import routes from './component/route';
import { BrowserRouter as Router } from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';

class Boardsite extends React.Component {
    render() {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                    {routes}
                </Router>
            </ThemeProvider>
        );
    }
}

// ========================================

ReactDOM.render(
    <Boardsite />,
    document.getElementById('root')
);
