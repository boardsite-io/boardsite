import React from "react"
import Tooltip from "@material-ui/core/Tooltip"
import { useSelector } from "react-redux"
import {
    MdExpandLess,
    MdExpandMore,
    MdFilterCenterFocus,
    MdOpenWith,
    MdZoomIn,
    MdZoomOut,
    MdZoomOutMap,
} from "react-icons/md"

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

    return (
        <div className="viewbar">
            <Tooltip
                id="tooltip"
                title="Page Up"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <button
                    type="button"
                    id="icon-button"
                    onClick={() => store.dispatch(JUMP_TO_PREV_PAGE())}>
                    <MdExpandLess id="icon" />
                </button>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="Return to First Page"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <button
                    type="button"
                    id="icon-button"
                    onClick={() => store.dispatch(JUMP_TO_FIRST_PAGE())}>
                    {currPageIndex}
                </button>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="Page Down"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <button
                    type="button"
                    id="icon-button"
                    onClick={() => store.dispatch(JUMP_TO_NEXT_PAGE())}>
                    <MdExpandMore id="icon" />
                </button>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="Toggle Panning"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                {isPanMode ? (
                    <button
                        type="button"
                        id="icon-button"
                        onClick={() => store.dispatch(TOGGLE_PANMODE())}>
                        <MdOpenWith id="icon" />
                    </button>
                ) : (
                    <button
                        type="button"
                        id="icon-button"
                        onClick={() => store.dispatch(TOGGLE_PANMODE())}>
                        <MdOpenWith id="icon" />
                    </button>
                )}
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="Zoom In"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <button
                    type="button"
                    id="icon-button"
                    onClick={() => store.dispatch(ZOOM_IN_CENTER())}>
                    <MdZoomIn id="icon" />
                </button>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="Zoom Out"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <button
                    type="button"
                    id="icon-button"
                    onClick={() => store.dispatch(ZOOM_OUT_CENTER())}>
                    <MdZoomOut id="icon" />
                </button>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="Fit to Page Width"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <button
                    type="button"
                    id="icon-button"
                    onClick={() => store.dispatch(FIT_WIDTH_TO_PAGE())}>
                    <MdZoomOutMap id="icon" />
                </button>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="Center View"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <button
                    type="button"
                    id="icon-button"
                    onClick={() => store.dispatch(CENTER_VIEW())}>
                    <MdFilterCenterFocus id="icon" />
                </button>
            </Tooltip>
        </div>
    )
}
