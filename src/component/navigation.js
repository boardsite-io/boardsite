import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import { Button, IconButton, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

function Navigation() {
    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <IconButton edge="start" aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6">
                    News
                </Typography>
                <Button color="inherit" style={{float: "right"}}>Login</Button>
            </Toolbar>
        </AppBar>
    );
}

export default Navigation;
