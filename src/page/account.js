import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';

function Account(props) {
    const useStyles = makeStyles({
        scrollPaper: {
            alignItems: 'baseline'  // default center
        }
    });
    const classes = useStyles();

    return (
        // <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        //     Open max-width dialog
        // </Button>
        <div id="accdialog">
            <Dialog
                classes={{ scrollPaper: classes.scrollPaper }}
                fullWidth="true"
                maxWidth="sm"
                open={props.openAccDialog}
                scroll="paper"
            >
                <DialogTitle>Optional sizes</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You can set my maximum width and whether to adapt or not.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => props.setOpenAccDialog(false)} color="primary">
                        Close
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Account;