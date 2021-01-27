import React from "react"
import ReactSlider from "react-slider"
import { useSelector } from "react-redux"
import { IconButton } from "@material-ui/core"
import Tooltip from "@material-ui/core/Tooltip"

import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp"
import { setWidth } from "../../redux/slice/drawcontrol"
import { WIDTH_MIN, WIDTH_MAX } from "../../constants"

import store from "../../redux/store"

export default function WidthSlider() {
    const widthSelector = useSelector(
        (state) => state.drawControl.liveStroke.style.width
    )

    const handleSliderChange = (newWidth) => {
        store.dispatch(setWidth(newWidth))
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

    const Track = (props, state) => {
        const { className, key, style } = props
        return (
            <div
                className={className}
                key={key}
                style={style}
                index={state.index}
            />
        )
    }

    return (
        <div className="width-picker">
            <ReactSlider
                className="width-slider"
                thumbClassName="width-slider-thumb"
                // trackClassName="width-slider-track"
                invert={false}
                orientation="vertical"
                value={typeof widthSelector === "number" ? widthSelector : 0}
                onAfterChange={handleSliderChange}
                // onChange={handleSliderChange}
                min={WIDTH_MIN}
                max={WIDTH_MAX}
                renderTrack={Track}
                renderThumb={Thumb}
            />
            <Tooltip
                id="tooltip"
                title="Decrease Width"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <IconButton
                    id="iconButton"
                    variant="contained"
                    onClick={() => {
                        if (widthSelector !== WIDTH_MIN) {
                            store.dispatch(setWidth(widthSelector - 1))
                        }
                    }}>
                    <KeyboardArrowUpIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="Increase Width"
                TransitionProps={{ timeout: 0 }}
                placement="left">
                <IconButton
                    id="iconButton"
                    variant="contained"
                    onClick={() => {
                        if (widthSelector !== WIDTH_MAX) {
                            store.dispatch(setWidth(widthSelector + 1))
                        }
                    }}>
                    <KeyboardArrowDownIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            {/* <input
                type="number"
                min={WIDTH_MIN}
                max={WIDTH_MAX}
                className="width-input"
                value={widthSelector}
                onChange={handleInputChange}
                onBlur={handleBlur}
            /> */}
        </div>
    )
}
