import React from "react"
import {
    BsArrowsMove,
    BsArrowsAngleContract,
    BsArrowsAngleExpand,
} from "react-icons/bs"
import store from "../../../../redux/store"
import { TOGGLE_PANMODE } from "../../../../redux/slice/drawcontrol"
import {
    FIT_WIDTH_TO_PAGE,
    RESET_VIEW,
} from "../../../../redux/slice/viewcontrol"
import { useCustomSelector } from "../../../../redux/hooks"
import IconButton from "../iconbutton/iconbutton"

const ViewOptions: React.FC = () => {
    const isPanMode = useCustomSelector((state) => state.drawControl.isPanMode)
    return (
        <>
            <IconButton
                active={isPanMode}
                onClick={() => store.dispatch(TOGGLE_PANMODE())}>
                <BsArrowsMove id="icon" />
            </IconButton>
            <IconButton onClick={() => store.dispatch(RESET_VIEW())}>
                <BsArrowsAngleContract id="icon" />
            </IconButton>
            <IconButton onClick={() => store.dispatch(FIT_WIDTH_TO_PAGE())}>
                <BsArrowsAngleExpand id="icon" />
            </IconButton>
        </>
    )
}

export default ViewOptions
