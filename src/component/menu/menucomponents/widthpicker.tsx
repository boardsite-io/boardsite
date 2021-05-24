import React from "react"
import ReactSlider from "react-slider"
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md"
import {
    SET_WIDTH,
    DECREMENT_WIDTH,
    INCREMENT_WIDTH,
} from "../../../redux/slice/drawcontrol"
import { WIDTH_MIN, WIDTH_MAX } from "../../../constants"
import store from "../../../redux/store"
import { useCustomSelector } from "../../../redux/hooks"

export default function WidthPicker() {
    const widthSelector = useCustomSelector(
        (state) => state.drawControl.liveStroke.style.width
    )

    const handleSliderChange = (newWidth) => {
        store.dispatch(SET_WIDTH(newWidth))
    }

    function handleUpClick() {
        store.dispatch(DECREMENT_WIDTH())
    }

    function handleDownClick() {
        store.dispatch(INCREMENT_WIDTH())
    }

    // const handleInputChange = (event) => {
    //     const width =
    //         event.target.value === "" ? "" : Number(event.target.value)
    //     store.dispatch(setWidth(width))
    // }

    // // Slider Functions
    // const handleBlur = () => {
    //     if (widthSelector < WIDTH_MIN) {
    //         store.dispatch(setWidth(WIDTH_MIN))
    //     } else if (widthSelector > WIDTH_MAX) {
    //         store.dispatch(setWidth(WIDTH_MAX))
    //     }
    // }

    const Thumb = (props, state) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <div {...props}>{state.valueNow}</div>
    )

    // const Track = (props, state) => {
    //     const { className, key, style } = props
    //     return (
    //         <div
    //             className={className}
    //             key={key}
    //             style={style}
    //             index={state.index}
    //         />
    //     )
    // }

    return (
        <div className="width-picker">
            <ReactSlider
                className="width-slider"
                thumbClassName="width-slider-thumb"
                // trackClassName="width-slider-track"
                invert={false}
                orientation="vertical"
                value={widthSelector}
                onAfterChange={handleSliderChange}
                // onChange={handleSliderChange}
                min={WIDTH_MIN}
                max={WIDTH_MAX}
                // renderTrack={Track}
                renderThumb={Thumb}
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
