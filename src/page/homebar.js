import React from 'react';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SaveIcon from '@material-ui/icons/Save';
import GetAppIcon from '@material-ui/icons/GetApp';
import { IconButton } from '@material-ui/core';
import theme from '../component/theme';

export default function Homebar(props) {

    function saveBoard() {
        // console.log(props.strokeCollection, props.hitboxCollection);
    }

    function loadBoard() {
        // console.log(props.undoStack, props.redoStack);
    }

    return (
        <div className="homebar" style={{
            backgroundColor: theme.palette.tertiary.main,
            border: theme.palette.tertiary.border,
        }}>
            <IconButton id="iconButton" variant="contained" onClick={() => props.setOpenAccDialog(true)}>
                <AccountBoxIcon color="secondary" id="iconButtonInner" />
            </IconButton>
            <IconButton id="iconButton" variant="contained" onClick={() => props.setOpenSessionDialog(true)}>
                <GroupAddIcon color="secondary" id="iconButtonInner" />
            </IconButton>
            <IconButton id="iconButton" variant="contained" color="primary" onClick={saveBoard}>
                <SaveIcon color="secondary" id="iconButtonInner" />
            </IconButton>
            <IconButton id="iconButton" variant="contained" color="primary" onClick={loadBoard}>
                <GetAppIcon color="secondary" id="iconButtonInner" />
            </IconButton>
        </div>
    );
}