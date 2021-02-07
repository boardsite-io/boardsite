import React from "react"
import ZoomInIcon from "@material-ui/icons/ZoomIn"
import ZoomOutIcon from "@material-ui/icons/ZoomOut"
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap"
import { IconButton } from "@material-ui/core"
import ExpandLessIcon from "@material-ui/icons/ExpandLess"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
// import AspectRatioIcon from "@material-ui/icons/AspectRatio"
// import SettingsOverscanIcon from "@material-ui/icons/SettingsOverscan"
import FilterCenterFocusIcon from "@material-ui/icons/FilterCenterFocus"
import Tooltip from "@material-ui/core/Tooltip"
// import FullscreenIcon from "@material-ui/icons/Fullscreen"
import OpenWithIcon from "@material-ui/icons/OpenWith"
import { useSelector } from "react-redux"

import store from "../../redux/store"
import { TOGGLE_PANMODE } from "../../redux/slice/drawcontrol"
import {
    ZOOM_IN_CENTER,
    ZOOM_OUT_CENTER,
    FIT_WIDTH_TO_PAGE,
    CENTER_VIEW,
    JUMP_TO_NEXT_PAGE,
    JUMP_TO_PREV_PAGE,
    JUMP_TO_FIRST_PAGE,
} from "../../redux/slice/viewcontrol"

export default function Viewbar() {
    const isPanMode = useSelector((state) => state.drawControl.isPanMode)
    const currPageIndex = useSelector(
        (state) => state.viewControl.currentPageIndex
    )

    function togglePanMode() {
        store.dispatch(TOGGLE_PANMODE())
    }

    function up() {
        store.dispatch(JUMP_TO_PREV_PAGE())
    }

    function down() {
        store.dispatch(JUMP_TO_NEXT_PAGE())
    }

    return (
        <div className="viewbar">
            <Tooltip
                id="tooltip"
                title="Page Up"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <IconButton id="iconButton" variant="contained" onClick={up}>
                    <ExpandLessIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="Return to First Page"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <IconButton
                    id="iconButton"
                    style={{ color: "#00d2be" }}
                    variant="contained"
                    onClick={() => store.dispatch(JUMP_TO_FIRST_PAGE())}>
                    {currPageIndex}
                </IconButton>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="Page Down"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <IconButton id="iconButton" variant="contained" onClick={down}>
                    <ExpandMoreIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>

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
                    onClick={() => store.dispatch(ZOOM_IN_CENTER())}>
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
                    onClick={() => store.dispatch(ZOOM_OUT_CENTER())}>
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
                    onClick={() => store.dispatch(FIT_WIDTH_TO_PAGE())}>
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
                    onClick={() => store.dispatch(CENTER_VIEW())}>
                    <FilterCenterFocusIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
        </div>
    )
}
