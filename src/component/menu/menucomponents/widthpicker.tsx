import React from "react"
import { Slider } from "@material-ui/core"
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md"
import {
    SET_WIDTH,
    DECREMENT_WIDTH,
    INCREMENT_WIDTH,
} from "../../../redux/slice/drawcontrol"
import { WIDTH_MIN, WIDTH_MAX, DEFAULT_WIDTH } from "../../../constants"
import store from "../../../redux/store"
import { useCustomSelector } from "../../../redux/hooks"

const WidthPicker: React.FC = () => {
    const widthSelector = useCustomSelector(
        (state) => state.drawControl.liveStroke.style.width
    )

    function handleUpClick() {
        store.dispatch(DECREMENT_WIDTH())
    }

    function handleDownClick() {
        store.dispatch(INCREMENT_WIDTH())
    }

    return (
        <div className="width-picker">
            <Slider
                value={typeof widthSelector === "number" ? widthSelector : 1}
                orientation="vertical"
                className="width-slider"
                onChange={(e, value) => {
                    store.dispatch(SET_WIDTH(value))
                }}
                defaultValue={DEFAULT_WIDTH}
                valueLabelDisplay="auto"
                step={1}
                marks={[{ value: WIDTH_MIN }, { value: WIDTH_MAX }]}
                min={WIDTH_MIN}
                max={WIDTH_MAX}
            />
            <button type="button" id="icon-button" onClick={handleUpClick}>
                <MdKeyboardArrowUp id="icon" />
            </button>
            <button type="button" id="icon-button" onClick={handleDownClick}>
                <MdKeyboardArrowDown id="icon" />
            </button>
        </div>
    )
}

export default WidthPicker
