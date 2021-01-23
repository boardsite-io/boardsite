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

import { CANVAS_WIDTH } from "../../constants.js"

export default function Viewbar(props) {
    const isActive = useSelector((state) => state.drawControl.isActive)
    console.log("Viewbar Redraw");

    function toggleDrawMode() {
        props.pan.disabled = !props.pan.disabled
        store.dispatch(setIsActive(props.pan.disabled))
    }

    function down(e) {
        props.setPositionY(props.positionY - 200)
    }

    function up(e) {
        props.setPositionY(props.positionY + 200)
    }

    function stretchToWindow() {
        const newScale = window.innerWidth / CANVAS_WIDTH
        // const y = (props.positionY / props.scale) * newScale
        props.setTransform(0,0,newScale,1000, "linear")
    }

    function resetAndCenter() {
        const w = window.innerWidth
        const x = (w - CANVAS_WIDTH) / 2
        const y = props.positionY / props.scale
        props.setScale(1, 0)
        props.setPositionX(x, 0)
        props.setPositionY(y, 0)
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
                    onClick={stretchToWindow}>
                    <ZoomOutMapIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="scroll up"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <IconButton id="iconButton" variant="contained" onClick={up}>
                    <ExpandLessIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="scroll down"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <IconButton id="iconButton" variant="contained" onClick={down}>
                    <ExpandMoreIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="center and reset scale"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <IconButton
                    id="iconButton"
                    variant="contained"
                    onClick={resetAndCenter}>
                    <FullscreenIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
        </div>
    )
}
