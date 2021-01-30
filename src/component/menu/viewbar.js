import React from "react"
import ZoomInIcon from "@material-ui/icons/ZoomIn"
import ZoomOutIcon from "@material-ui/icons/ZoomOut"
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap"
import { IconButton } from "@material-ui/core"
// import ExpandLessIcon from "@material-ui/icons/ExpandLess"
// import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
// import AspectRatioIcon from "@material-ui/icons/AspectRatio"
// import SettingsOverscanIcon from "@material-ui/icons/SettingsOverscan"
import FilterCenterFocusIcon from "@material-ui/icons/FilterCenterFocus"
import Tooltip from "@material-ui/core/Tooltip"
// import FullscreenIcon from "@material-ui/icons/Fullscreen"
import OpenWithIcon from "@material-ui/icons/OpenWith"
import { useSelector } from "react-redux"

import store from "../../redux/store"
import { TOGGLE_PANMODE } from "../../redux/slice/drawcontrol"

export default function Viewbar({ fitToPage, center, zoomIn, zoomOut }) {
    // console.log("Viewbar Redraw");
    const isDraggable = useSelector((state) => state.drawControl.isDraggable)
    const isListening = useSelector((state) => state.drawControl.isListening)
    const isPanMode = useSelector((state) => state.drawControl.isPanMode)
    const isMouseDown = useSelector((state) => state.drawControl.isMouseDown)

    function togglePanMode() {
        store.dispatch(TOGGLE_PANMODE())
    }

    return (
        <div className="viewbar">
            {isMouseDown ? (
                <IconButton id="iconButtonActive" variant="contained">
                    M
                </IconButton>
            ) : (
                <IconButton id="iconButton" variant="contained">
                    M
                </IconButton>
            )}
            {isDraggable ? (
                <IconButton id="iconButtonActive" variant="contained">
                    D
                </IconButton>
            ) : (
                <IconButton id="iconButton" variant="contained">
                    D
                </IconButton>
            )}
            {isListening ? (
                <IconButton id="iconButtonActive" variant="contained">
                    L
                </IconButton>
            ) : (
                <IconButton id="iconButton" variant="contained">
                    L
                </IconButton>
            )}
            <Tooltip
                id="tooltip"
                title="toggle panning"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                {isPanMode ? (
                    <IconButton
                        id="iconButtonActive"
                        variant="contained"
                        onClick={togglePanMode}>
                        <OpenWithIcon id="iconButtonActiveInner" />
                    </IconButton>
                ) : (
                    <IconButton
                        id="iconButton"
                        variant="contained"
                        onClick={togglePanMode}>
                        <OpenWithIcon id="iconButtonInner" />
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
            <Tooltip
                id="tooltip"
                title="Fit to Page Width"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <IconButton
                    id="iconButton"
                    variant="contained"
                    onClick={fitToPage}>
                    <ZoomOutMapIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="Center View"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <IconButton
                    id="iconButton"
                    variant="contained"
                    onClick={center}>
                    <FilterCenterFocusIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            {/* <Tooltip
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
            </Tooltip> */}
        </div>
    )
}
