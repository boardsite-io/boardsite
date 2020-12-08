import React from 'react';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import PanToolIcon from '@material-ui/icons/PanTool';
import { IconButton } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Tooltip from '@material-ui/core/Tooltip';

export default function Viewbar(props) {

    function toggleDrawMode() {
        props.pan.disabled = !props.pan.disabled;
        props.isDrawModeRef.current = props.pan.disabled;
    }

    function down(e) {
        props.setPositionY(props.positionY - 200);
    }

    function up(e) {
        props.setPositionY(props.positionY + 200);
    }

    function stretchToWindow() {
        props.setScale(window.innerWidth / 710, 0);
        props.setPositionX(0, 0);
        // let x = props.positionX + 
        // console.log(props.positionX, props.positionY);
        // props.setPositionY(60,0)
    }

    return (
        <div className="viewbar">
            <Tooltip id="tooltip" title="toggle panning" TransitionProps={{ timeout: 0 }}>
                <IconButton id="iconButton" variant="contained" onClick={toggleDrawMode}>
                    <PanToolIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            <Tooltip id="tooltip" title="zoom in" TransitionProps={{ timeout: 0 }}>
                <IconButton id="iconButton" variant="contained" onClick={props.zoomIn}>
                    <ZoomInIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            <Tooltip id="tooltip" title="zoom out" TransitionProps={{ timeout: 0 }}>
                <IconButton id="iconButton" variant="contained" onClick={props.zoomOut}>
                    <ZoomOutIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            <Tooltip id="tooltip" title="reset transform" TransitionProps={{ timeout: 0 }}>
                <IconButton id="iconButton" variant="contained" onClick={props.resetTransform}>
                    <ZoomOutMapIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            <Tooltip id="tooltip" title="scroll up" TransitionProps={{ timeout: 0 }}>
                <IconButton id="iconButton" variant="contained" onClick={up}>
                    <ExpandLessIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            <Tooltip id="tooltip" title="scroll down" TransitionProps={{ timeout: 0 }}>
                <IconButton id="iconButton" variant="contained" onClick={down}>
                    <ExpandMoreIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            <Tooltip id="tooltip" title="fit width to page" TransitionProps={{ timeout: 0 }}>
                <IconButton id="iconButton" variant="contained" onClick={stretchToWindow}>
                    <ZoomOutMapIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
        </div>
    );
}