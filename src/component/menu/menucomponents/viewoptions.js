import React from "react"

import Tooltip from "@material-ui/core/Tooltip"
import { useSelector } from "react-redux"
import { MdFilterCenterFocus, MdOpenWith, MdZoomOutMap } from "react-icons/md"

import store from "../../../redux/store"
import { TOGGLE_PANMODE } from "../../../redux/slice/drawcontrol"
import {
    FIT_WIDTH_TO_PAGE,
    CENTER_VIEW,
} from "../../../redux/slice/viewcontrol"
import "../../../css/viewoptions.css"

export default function ViewOptions() {
    const isPanMode = useSelector((state) => state.drawControl.isPanMode)
    return (
        <div className="viewoptions-wrap">
            <Tooltip
                id="tooltip"
                title="Toggle Panning"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                {isPanMode ? (
                    <button
                        type="button"
                        id="icon-button-active"
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
        </div>
    )
}
