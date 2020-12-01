import React from 'react';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import PanToolIcon from '@material-ui/icons/PanTool';
import { IconButton } from '@material-ui/core';
import theme from '../component/theme';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export default function Viewbar(props) {

    function toggleDrawMode() {
        props.pan.disabled = !props.pan.disabled;
        props.isDrawModeRef.current = props.pan.disabled;
    }

    function down(e) {
        props.setPositionY(props.positionY - 100);
    }

    function up(e) {
        props.setPositionY(props.positionY + 100);
    }

    return (
        <div className="viewbar" style={{
            backgroundColor: theme.palette.tertiary.main,
            border: theme.palette.tertiary.border,
        }}>
            <IconButton id="iconButton" variant="contained" color="primary" onClick={toggleDrawMode}>
                <PanToolIcon color="secondary" id="iconButtonInner" />
            </IconButton>
            <IconButton id="iconButton" variant="contained" color="primary" onClick={props.zoomIn}>
                <ZoomInIcon color="secondary" id="iconButtonInner" />
            </IconButton>
            <IconButton id="iconButton" variant="contained" color="primary" onClick={props.zoomOut}>
                <ZoomOutIcon color="secondary" id="iconButtonInner" />
            </IconButton>
            <IconButton id="iconButton" variant="contained" color="primary" onClick={props.resetTransform}>
                <ZoomOutMapIcon color="secondary" id="iconButtonInner" />
            </IconButton>
            <IconButton id="iconButton" variant="contained" color="primary" onClick={up}>
                <ExpandLessIcon color="secondary" id="iconButtonInner" />
            </IconButton>
            <IconButton id="iconButton" variant="contained" color="primary" onClick={down}>
                <ExpandMoreIcon color="secondary" id="iconButtonInner" />
            </IconButton>
        </div>
    );
}