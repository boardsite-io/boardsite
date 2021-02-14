import React from "react"
import { useSelector } from "react-redux"
import { MdFilterCenterFocus, MdOpenWith, MdZoomOutMap } from "react-icons/md"
import store from "../../../redux/store"
import { TOGGLE_PANMODE } from "../../../redux/slice/drawcontrol"
import {
    FIT_WIDTH_TO_PAGE,
    CENTER_VIEW,
} from "../../../redux/slice/viewcontrol"
import "../../../css/menucomponents/viewoptions.css"

export default function ViewOptions() {
    const isPanMode = useSelector((state) => state.drawControl.isPanMode)
    return (
        <div className="viewoptions-wrap">
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
            <button
                type="button"
                id="icon-button"
                onClick={() => store.dispatch(CENTER_VIEW())}>
                <MdFilterCenterFocus id="icon" />
            </button>
            <button
                type="button"
                id="icon-button"
                onClick={() => store.dispatch(FIT_WIDTH_TO_PAGE())}>
                <MdZoomOutMap id="icon" />
            </button>
        </div>
    )
}
