import React from "react"
import { ExpandIcon, PanIcon, ShrinkIcon } from "components"
import IconButton from "../../../components/iconbutton/iconbutton"
import store from "../../../redux/store"
import { TOGGLE_PANMODE } from "../../../redux/slice/drawcontrol"
import { FIT_WIDTH_TO_PAGE, RESET_VIEW } from "../../../redux/slice/viewcontrol"
import { useCustomSelector } from "../../../redux/hooks"

const ViewOptions: React.FC = () => {
    const isPanMode = useCustomSelector((state) => state.drawControl.isPanMode)
    return (
        <>
            <IconButton
                active={isPanMode}
                onClick={() => store.dispatch(TOGGLE_PANMODE())}>
                <PanIcon />
            </IconButton>
            <IconButton onClick={() => store.dispatch(RESET_VIEW())}>
                <ShrinkIcon />
            </IconButton>
            <IconButton onClick={() => store.dispatch(FIT_WIDTH_TO_PAGE())}>
                <ExpandIcon />
            </IconButton>
        </>
    )
}

export default ViewOptions
