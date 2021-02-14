import React, { useState } from "react"
import { SketchPicker } from "react-color"
import { useSelector } from "react-redux"
import { MdPalette } from "react-icons/md"
import "../../../css/menucomponents/colorpicker.css"
import Tooltip from "@material-ui/core/Tooltip"
import { SET_COLOR } from "../../../redux/slice/drawcontrol"
import store from "../../../redux/store"

export default function ColorPicker() {
    const colorSelector = useSelector(
        (state) => state.drawControl.liveStroke.style.color
    )

    function handlePaletteClick() {
        setDisplayColorPicker(!displayColorPicker)
    }

    function handlePaletteClose() {
        setDisplayColorPicker(false)
    }

    function handlePaletteChange(color) {
        store.dispatch(SET_COLOR(color.hex))
    }

    const [displayColorPicker, setDisplayColorPicker] = useState(false)

    return (
        <div className="color-picker-div">
            <Tooltip
                id="tooltip"
                title="Color"
                TransitionProps={{ timeout: 0 }}
                placement="bottom">
                <button
                    type="button"
                    id="icon-button"
                    onClick={handlePaletteClick}>
                    <MdPalette id="icon" />
                </button>
            </Tooltip>
            {
                // Palette Popup
                displayColorPicker ? (
                    <div className="popup">
                        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                        <div
                            className="cover"
                            onClick={handlePaletteClose}
                            onKeyPress={() => {}}
                        />
                        <div className="color-picker">
                            <SketchPicker
                                width={250}
                                className="color"
                                presetColors={[
                                    "#D0021B",
                                    "#F5A623",
                                    "#F8E71C",
                                    "#8B572A",
                                    "#7ED321",
                                    "#417505",
                                    "#BD10E0",
                                    "#9013FE",
                                    "#4A90E2",
                                    "#50E3C2",
                                    "#B8E986",
                                    "#000000",
                                    "#4A4A4A",
                                    "#9B9B9B",
                                    "#FFFFFF",
                                ]}
                                disableAlpha
                                color={colorSelector}
                                onChange={handlePaletteChange}
                            />
                        </div>
                    </div>
                ) : null
            }
        </div>
    )
}
