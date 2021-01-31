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
    // console.log("Viewbar Redraw")
    const isPanMode = useSelector((state) => state.drawControl.isPanMode)
    const currPageIndex = useSelector(
        (state) => state.drawControl.currPageIndex
    )

    function togglePanMode() {
        store.dispatch(TOGGLE_PANMODE())
    }

    return (
        <div className="viewbar">
            <IconButton
                id="iconButton"
                style={{ color: "#00d2be" }}
                variant="contained"
                onClick={togglePanMode}>
                {currPageIndex}
            </IconButton>
            <Tooltip
                id="tooltip"
                title="Toggle Panning"
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
                title="Zoom In"
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
                title="Zoom Out"
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
