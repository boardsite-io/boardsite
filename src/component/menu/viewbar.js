import React from "react"
import ZoomInIcon from "@material-ui/icons/ZoomIn"
import ZoomOutIcon from "@material-ui/icons/ZoomOut"
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap"
import { IconButton } from "@material-ui/core"
import ExpandLessIcon from "@material-ui/icons/ExpandLess"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import Tooltip from "@material-ui/core/Tooltip"
import FullscreenIcon from "@material-ui/icons/Fullscreen"
import OpenWithIcon from "@material-ui/icons/OpenWith"

import store from "../../redux/store.js"
import { setIsActive } from "../../redux/slice/drawcontrol.js"
import { useSelector } from "react-redux"

export default function Viewbar(props) {
    console.log("Viewbar Redraw");
    const isActive = useSelector((state) => state.drawControl.isActive)
    
    function toggleDrawMode() {
        props.pan.disabled = !props.pan.disabled
        store.dispatch(setIsActive(props.pan.disabled))
    }

    return (
        <div className="viewbar">
            <Tooltip
                id="tooltip"
                title="toggle panning"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                {isActive ? (
                    <IconButton
                        id="iconButton"
                        variant="contained"
                        onClick={toggleDrawMode}>
                        <OpenWithIcon id="iconButtonInner" />
                    </IconButton>
                ) : (
                    <IconButton
                        id="iconButtonActive"
                        variant="contained"
                        onClick={toggleDrawMode}>
                        <OpenWithIcon id="iconButtonActiveInner" />
                    </IconButton>
                )}
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="zoom in"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <IconButton
                    id="iconButton"
                    variant="contained"
                    onClick={props.zoomIn}>
                    <ZoomInIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="zoom out"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <IconButton
                    id="iconButton"
                    variant="contained"
                    onClick={props.zoomOut}>
                    <ZoomOutIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="fit page width"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <IconButton
                    id="iconButton"
                    variant="contained"
                    onClick={props.stretchToWindow}>
                    <ZoomOutMapIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="Scroll Up"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <IconButton id="iconButton" variant="contained" onClick={props.up}>
                    <ExpandLessIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="Scroll Down"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <IconButton id="iconButton" variant="contained" onClick={props.down}>
                    <ExpandMoreIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="Reset View"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <IconButton
                    id="iconButton"
                    variant="contained"
                    onClick={props.resetTransform}>
                    <FullscreenIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
        </div>
    )
}
