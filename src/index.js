import React from 'react';
import ReactDOM from 'react-dom';

import './css/index.css';
import './css/whiteboard.css';
import './css/toolbar.css';
import './css/buttons.css';
import './css/homebar.css';

import theme from './component/theme';
import routes from './component/route';
import { BrowserRouter as Router } from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';

class Boardsite extends React.Component {
    render() {
        return (
            <ThemeProvider theme={theme}>
                {/* <h1 id="watermark" style={{
                    color: theme.palette.primary.main, 
                    backgroundColor: theme.palette.secondary.main,
                    border: "2px solid" + theme.palette.primary.main
                    }} >BoardSite</h1> */}
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
