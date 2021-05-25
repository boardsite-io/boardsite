import React from "react"
import { createMuiTheme, Slider, ThemeProvider } from "@material-ui/core"
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

    const WidthSlider = createMuiTheme({
        overrides: {
            MuiSlider: {
                root: {
                    color: "#888",
                },
                thumb: {
                    // height: 24,
                    // width: 24,
                    backgroundColor: "#000",
                    border: "2px solid #fff",
                    marginTop: -8,
                    marginLeft: -12,
                    "&:focus, &:hover, &$active": {
                        boxShadow: "inherit",
                    },
                },
                active: {},
                valueLabel: {
                    left: "calc(-50% - 8px)",
                },
                track: {
                    height: 8,
                    borderRadius: 4,
                },
                rail: {
                    height: 8,
                    borderRadius: 4,
                },
            },
        },
    })

    return (
        <div className="width-picker">
            <div className="width-slider-wrap">
                <ThemeProvider theme={WidthSlider}>
                    <Slider
                        value={
                            typeof widthSelector === "number"
                                ? widthSelector
                                : 1
                        }
                        orientation="vertical"
                        className="width-slider"
                        onChange={(e, value) => {
                            store.dispatch(SET_WIDTH(value))
                        }}
                        defaultValue={DEFAULT_WIDTH}
                        valueLabelDisplay="auto"
                        step={1}
                        // marks={[{ value: WIDTH_MIN }, { value: WIDTH_MAX }]}
                        min={WIDTH_MIN}
                        max={WIDTH_MAX}
                    />
                </ThemeProvider>
            </div>
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
