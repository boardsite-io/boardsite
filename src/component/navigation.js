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
import Tooltip from '@material-ui/core/Tooltip';

import UserLogin from './userlogin.js'

// import '../css/index.css';

function Navigation() {
    const [openAccDialog, setOpenAccDialog] = React.useState(false);

    return (
        <>
        <AppBar position="static" color="primary">
            <Toolbar>
                <Grid
                    justify="space-between"
                    container
                    spacing={0}
                >
                    <Tooltip title="Home">
                        <Link to="/">
                            <IconButton edge="start" aria-label="home">
                                <HomeIcon />
                            </IconButton>
                        </Link>
                    </Tooltip>
                    <Tooltip title="Create">
                        <Link to="/s=420guccigang">
                            <IconButton edge="start" aria-label="add">
                                <AddIcon />
                            </IconButton>
                        </Link>
                    </Tooltip>
                    <Tooltip title="Cloud Backup">
                        <Link to="/backup">
                            <IconButton edge="start" aria-label="backup">
                                <BackupIcon />
                            </IconButton>
                        </Link>
                    </Tooltip>
                    <div style={{ flex: 0.9 }}> {/* Lower flex -> more space between icons */}
                        <Tooltip title="Chat">
                            <Link to="/chat">
                                <IconButton edge="start" aria-label="chat">
                                    <ChatIcon />
                                </IconButton>
                            </Link>
                        </Tooltip>
                    </div>
                    <Tooltip title="About">
                        <Link to="/about">
                            <IconButton edge="start" aria-label="about">
                                <InfoIcon />
                            </IconButton>
                        </Link>
                    </Tooltip>
                    <Tooltip title="Account">
                            <IconButton edge="start" aria-label="account" onClick={() => setOpenAccDialog(true)}>
                                <AccountBoxIcon />
                            </IconButton>
                    </Tooltip>
                </Grid>
            </Toolbar>
        </AppBar>
        <UserLogin openAccDialog={openAccDialog} setOpenAccDialog={setOpenAccDialog} />
        </>
    );
}

export default Navigation;
