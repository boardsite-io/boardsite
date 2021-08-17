import React from "react"
import { createMuiTheme, Slider, ThemeProvider } from "@material-ui/core"
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md"
import {
    SET_WIDTH,
    DECREMENT_WIDTH,
    INCREMENT_WIDTH,
} from "../../../../../redux/slice/drawcontrol"
import { WIDTH_MIN, WIDTH_MAX, DEFAULT_WIDTH } from "../../../../../constants"
import store from "../../../../../redux/store"
import { useCustomSelector } from "../../../../../redux/hooks"
import { WidthTools, WidthToolsSlider } from "./widthpicker.styled"
import IconButton from "../../iconbutton/iconbutton"

const WidthPicker: React.FC = () => {
    const widthSelector = useCustomSelector(
        (state) => state.drawControl.liveStroke.style.width
    )

    function handleUpClick() {
        store.dispatch(INCREMENT_WIDTH())
    }

    function handleDownClick() {
        store.dispatch(DECREMENT_WIDTH())
    }

    const WidthSlider = createMuiTheme({
        overrides: {
            MuiSlider: {
                root: {
                    marginLeft: -2,
                    color: "#fff",
                },
                thumb: {
                    height: 14,
                    width: 14,
                    backgroundColor: "#000",
                    border: "2px solid #fff",
                },
                active: {},
                valueLabel: {
                    left: "calc(-50% - 6px)",
                    color: "#222",
                },
                track: {
                    width: "8px !important",
                    borderRadius: 4,
                    marginLeft: -2,
                },
                rail: {
                    width: "8px !important",
                    borderRadius: 4,
                    marginLeft: -2,
                },
            },
        },
    })

    return (
        <WidthTools>
            <WidthToolsSlider>
                <ThemeProvider theme={WidthSlider}>
                    <Slider
                        value={
                            typeof widthSelector === "number"
                                ? widthSelector
                                : 1
                        }
                        orientation="vertical"
                        // className="width-slider"
                        onChange={(e, value) => {
                            store.dispatch(SET_WIDTH(value))
                        }}
                        defaultValue={DEFAULT_WIDTH}
                        valueLabelDisplay="on"
                        step={1}
                        // marks={[{ value: WIDTH_MIN }, { value: WIDTH_MAX }]}
                        min={WIDTH_MIN}
                        max={WIDTH_MAX}
                    />
                </ThemeProvider>
            </WidthToolsSlider>
            <IconButton onClick={handleUpClick}>
                <MdKeyboardArrowUp id="icon" />
            </IconButton>
            <IconButton onClick={handleDownClick}>
                <MdKeyboardArrowDown id="icon" />
            </IconButton>
        </WidthTools>
    )
}

export default WidthPicker
