import React from 'react';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import PanToolIcon from '@material-ui/icons/PanTool';
import { IconButton } from '@material-ui/core';
import theme from '../component/theme';

export default function Viewbar(props) {

    function toggleDrawMode() {
        props.options.disabled = !props.options.disabled;
        props.isDrawModeRef.current = props.options.disabled;
    }

    function zoomIn(e) {
        if (props.options.disabled) {
            props.options.disabled = false;
            props.zoomIn(e);
            props.options.disabled = true;
        }
        else{
            props.zoomIn(e);
        }
    }

    function zoomOut(e) {
        if (props.options.disabled) {
            props.options.disabled = false;
            props.zoomOut(e);
            props.options.disabled = true;
        }
        else{
            props.zoomOut(e);
        }
    }

    function resetTransform(e) {
        if (props.options.disabled) {
            props.options.disabled = false;
            props.resetTransform(e);
            props.options.disabled = true;
        }
        else{
            props.resetTransform(e);
        }
    }



    return (
        <div className="viewbar" style={{
            backgroundColor: theme.palette.tertiary.main,
            border: theme.palette.tertiary.border,
        }}>
            <IconButton id="iconButton" variant="contained" color="primary" onClick={toggleDrawMode}>
                <PanToolIcon color="secondary" id="iconButtonInner" />
            </IconButton>
            <IconButton id="iconButton" variant="contained" color="primary" onClick={zoomIn}>
                <ZoomInIcon color="secondary" id="iconButtonInner" />
            </IconButton>
            <IconButton id="iconButton" variant="contained" color="primary" onClick={zoomOut}>
                <ZoomOutIcon color="secondary" id="iconButtonInner" />
            </IconButton>
            <IconButton id="iconButton" variant="contained" color="primary" onClick={resetTransform}>
                <ZoomOutMapIcon color="secondary" id="iconButtonInner" />
            </IconButton>
            <IconButton id="iconButton" variant="contained" color="primary" onClick={null}>
            </IconButton>
        </div>
    );
}