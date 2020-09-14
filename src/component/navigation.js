import React from 'react';
import { Link } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import { Grid, IconButton, Toolbar } from '@material-ui/core';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import BackupIcon from '@material-ui/icons/Backup';
import ChatIcon from '@material-ui/icons/Chat';
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';
import InfoIcon from '@material-ui/icons/Info';

function Navigation() {
    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Grid
                    justify="space-between"
                    container
                    spacing={0}
                >
                    <Link to="/">
                        <IconButton edge="start" aria-label="home">
                            <HomeIcon />
                        </IconButton>
                    </Link>
                    <Link to="/add">
                        <IconButton edge="start" aria-label="add">
                            <AddIcon />
                        </IconButton>
                    </Link>
                    <Link to="/backup">
                        <IconButton edge="start" aria-label="backup">
                            <BackupIcon />
                        </IconButton>
                    </Link>
                    <Link to="/chat">
                        <IconButton edge="start" aria-label="chat">
                            <ChatIcon />
                        </IconButton>
                    </Link>
                    <Link to="/about">
                        <IconButton edge="start" aria-label="about">
                            <InfoIcon />
                        </IconButton>
                    </Link>
                    <Link to="/account">
                        <IconButton edge="start" aria-label="account">
                            <AccountBoxIcon />
                        </IconButton>
                    </Link>
                </Grid>
            </Toolbar>
        </AppBar>
    );
}

export default Navigation;
