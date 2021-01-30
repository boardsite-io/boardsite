import React from "react"
import ZoomInIcon from "@material-ui/icons/ZoomIn"
import ZoomOutIcon from "@material-ui/icons/ZoomOut"
// import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap"
import { IconButton } from "@material-ui/core"
// import ExpandLessIcon from "@material-ui/icons/ExpandLess"
// import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import Tooltip from "@material-ui/core/Tooltip"
// import FullscreenIcon from "@material-ui/icons/Fullscreen"
import OpenWithIcon from "@material-ui/icons/OpenWith"
import { useSelector } from "react-redux"

import store from "../../redux/store"
import { TOGGLE_DRAWMODE } from "../../redux/slice/drawcontrol"

export default function Viewbar({ fitToPage, center, zoomIn, zoomOut }) {
    // console.log("Viewbar Redraw");
    const isActive = useSelector((state) => state.drawControl.isActive)

    function toggleDrawMode() {
        store.dispatch(TOGGLE_DRAWMODE())
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
            <IconButton
                id="iconButton"
                style={{ backgroundColor: "blue" }}
                onClick={fitToPage}>
                1
            </IconButton>
            <IconButton
                id="iconButton"
                style={{ backgroundColor: "green" }}
                onClick={center}>
                2
            </IconButton>
            <Tooltip
                id="tooltip"
                title="zoom in"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <IconButton
                    id="iconButton"
                    variant="contained"
                    onClick={zoomIn}>
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
                    onClick={zoomOut}>
                    <ZoomOutIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            {/* <Tooltip
                id="tooltip"
                title="fit page width"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <IconButton
                    id="iconButton"
                    variant="contained"
                    onClick={stretchToWindow}>
                    <ZoomOutMapIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="Scroll Up"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <IconButton id="iconButton" variant="contained" onClick={up}>
                    <ExpandLessIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="Scroll Down"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <IconButton id="iconButton" variant="contained" onClick={down}>
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
                    onClick={resetTransform}>
                    <FullscreenIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip> */}
        </div>
    )
}
