import React from 'react';
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialog(props) {

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={() => props.setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Let Google scam you.
                    </DialogContentText>
                    <div className="homepage">
                        <Button variant="contained"
                            color="primary" onClick={() => props.handleCreate()}>Create Session</Button>
                        <Button variant="contained"
                            color="primary" onClick={() => props.handleJoin()}>Join Session</Button>
                        <TextField defaultValue={''} onChange={(e) => props.handleTextFieldChange(e)}
                            label="Insert Session ID" variant="outlined" />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => props.setOpen(false)} color="primary">
                        Disagree
                </Button>
                    <Button onClick={() => props.setOpen(false)} color="primary" autoFocus>
                        Agree
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}