import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import { Grid, IconButton, Toolbar } from '@material-ui/core';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import BackupIcon from '@material-ui/icons/Backup';
import ChatIcon from '@material-ui/icons/Chat';
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';


function Navigation() {
    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Grid
                    justify="space-between"
                    container
                    spacing={0}
                >
                    <IconButton edge="start" aria-label="home">
                        <HomeIcon />
                    </IconButton>
                    <IconButton edge="start" aria-label="add">
                        <AddIcon />
                    </IconButton>
                    <IconButton edge="start" aria-label="account">
                        <AccountBoxIcon />
                    </IconButton>
                    <IconButton edge="start" aria-label="backup">
                        <BackupIcon />
                    </IconButton>
                    <IconButton edge="start" aria-label="chat">
                        <ChatIcon />
                    </IconButton>
                </Grid>
            </Toolbar>
        </AppBar>
    );
}

export default Navigation;
