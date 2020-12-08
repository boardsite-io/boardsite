import React from 'react';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import SaveIcon from '@material-ui/icons/Save';
import GetAppIcon from '@material-ui/icons/GetApp';
import { IconButton } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

export default function Homebar(props) {

    function saveBoard() {
        // console.log(props.strokeCollection, props.hitboxCollection);
    }

    function loadBoard() {
        // console.log(props.undoStack, props.redoStack);
    }

    return (
        <div className="homebar">
            <Tooltip id="tooltip" title="Join or Create Session">
                <IconButton id="iconButton" variant="contained" onClick={() => props.setOpenSessionDialog(true)}>
                    <GroupAddIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            <Tooltip id="tooltip" title="Save">
                <IconButton id="iconButton" variant="contained" onClick={saveBoard}>
                    <SaveIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            <Tooltip id="tooltip" title="Load">
                <IconButton id="iconButton" variant="contained" onClick={loadBoard}>
                    <GetAppIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
        </div>
    );
}