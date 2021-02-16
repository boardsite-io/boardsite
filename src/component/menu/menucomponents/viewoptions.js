import React from "react"
import { useSelector } from "react-redux"
import { CgController } from "react-icons/cg"
import {
    BsArrowsMove,
    BsArrowsAngleContract,
    BsArrowsAngleExpand,
} from "react-icons/bs"
import store from "../../../redux/store"
import { TOGGLE_PANMODE } from "../../../redux/slice/drawcontrol"
import { FIT_WIDTH_TO_PAGE, RESET_VIEW } from "../../../redux/slice/viewcontrol"
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
                    <CgController id="icon" />
                </button>
            ) : (
                <button
                    type="button"
                    id="icon-button"
                    onClick={() => store.dispatch(TOGGLE_PANMODE())}>
                    <BsArrowsMove id="icon" />
                </button>
            )}
            <button
                type="button"
                id="icon-button"
                onClick={() => store.dispatch(RESET_VIEW())}>
                <BsArrowsAngleContract id="icon" />
            </button>
            <button
                type="button"
                id="icon-button"
                onClick={() => store.dispatch(FIT_WIDTH_TO_PAGE())}>
                <BsArrowsAngleExpand id="icon" />
            </button>
        </div>
    )
}
