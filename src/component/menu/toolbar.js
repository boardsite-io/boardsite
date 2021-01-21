import React, { useState } from "react"
import { IconButton, Input, Slider } from "@material-ui/core"
import PaletteIcon from "@material-ui/icons/Palette"
import CreateIcon from "@material-ui/icons/Create"
import { SketchPicker } from "react-color"
import RemoveIcon from "@material-ui/icons/Remove"
import ChangeHistoryIcon from "@material-ui/icons/ChangeHistory"
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked"
import BrushIcon from "@material-ui/icons/Brush"
import HighlightOffIcon from "@material-ui/icons/HighlightOff"
import Tooltip from "@material-ui/core/Tooltip"

import store from "../../redux/store.js"
import { useSelector } from "react-redux"
import { setColor, setWidth, setTool } from "../../redux/slice/drawcontrol.js"
import { tool, WIDTH_MIN, WIDTH_MAX, WIDTH_STEP } from "../../constants.js"

import UndoRedo from './undoredo'

function Toolbar(props) {
    const [displayColorPicker, setDisplayColorPicker] = useState(false)
    const [displayWidthPicker, setDisplayWidthPicker] = useState(false)
    const [displayExtraTools, setDisplayExtraTools] = useState(false)
    const toolSelector = useSelector(state => state.drawControl.tool)
    const widthSelector = useSelector(state => state.drawControl.style.width)
    const colorSelector = useSelector(state => state.drawControl.style.color)

    function handlePaletteClick() {
        setDisplayColorPicker(!displayColorPicker)
    }

    function handleWidthClick() {
        setDisplayWidthPicker(!displayWidthPicker)
    }

    function handlePaletteClose() {
        setDisplayColorPicker(false)
    }

    function handleWidthClose() {
        setDisplayWidthPicker(false)
    }

    function handlePaletteChange(color) {
        store.dispatch(setColor(color.hex))
    }

    const handleSliderChange = (event, width) => {
        store.dispatch(setWidth(width))
    }

    const handleInputChange = (event) => {
        const width = event.target.value === "" ? "" : Number(event.target.value)
        store.dispatch(setWidth(width))
    }

    // Slider Functions
    const handleBlur = () => {
        if (widthSelector < WIDTH_MIN) {
            store.dispatch(setWidth(WIDTH_MIN))
        } else if (widthSelector > WIDTH_MAX) {
            store.dispatch(setWidth(WIDTH_MAX))
        }
    }

    return (
        <div className="toolbar">
            <IconButton id="iconButton" style={{ backgroundColor: "grey" }} onClick={props.debug}>
                D
            </IconButton>
            <UndoRedo />
            <div className="toolring">
                <Tooltip id="tooltip" title="Pen (P)" TransitionProps={{ timeout: 0 }} placement="bottom">
                    <IconButton
                        id={toolSelector === tool.PEN ? "iconButtonActive" : "iconButton"}
                        variant="contained"
                        onClick={toolSelector === tool.PEN ?
                            () => setDisplayExtraTools((prev) => !prev)
                            :
                            () => {
                                setDisplayExtraTools(false)
                                store.dispatch(setTool(tool.PEN))
                            }
                        }>
                        <BrushIcon id={toolSelector === tool.PEN ? "iconButtonActiveInner" : "iconButtonInner"} />
                    </IconButton>
                </Tooltip>
                <Tooltip id="tooltip" title="Eraser (E)" TransitionProps={{ timeout: 0 }} placement="bottom">
                    <IconButton
                        id={toolSelector === tool.ERASER ? "iconButtonActive" : "iconButton"}
                        variant="contained"
                        onClick={() => store.dispatch(setTool(tool.ERASER))}>
                        <HighlightOffIcon id={toolSelector === tool.ERASER ? "iconButtonActiveInner" : "iconButtonInner"} />
                    </IconButton>
                </Tooltip>
            </div>
            {displayExtraTools ? (
                <div className="extratools">
                    <Tooltip id="tooltip" title="Line" TransitionProps={{ timeout: 0 }} placement="bottom">
                        <IconButton
                            id={toolSelector === tool.LINE ? "iconButtonActive" : "iconButton"}
                            variant="contained"
                            onClick={toolSelector === tool.LINE ? 
                                () => setDisplayExtraTools(false)
                                : 
                                () => store.dispatch(setTool(tool.LINE))
                            }>
                            <RemoveIcon id={toolSelector === tool.LINE ? "iconButtonActiveInner" : "iconButtonInner"} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip id="tooltip" title="Triangle" TransitionProps={{ timeout: 0 }} placement="bottom">
                        <IconButton
                            id={toolSelector === tool.TRIANGLE ? "iconButtonActive" : "iconButton"}
                            variant="contained"
                            onClick={toolSelector === tool.TRIANGLE ? 
                                () => setDisplayExtraTools(false)
                                : 
                                () => store.dispatch(setTool(tool.TRIANGLE))
                            }>
                            <ChangeHistoryIcon id={toolSelector === tool.TRIANGLE ? "iconButtonActiveInner" : "iconButtonInner"} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip id="tooltip" title="Circle" TransitionProps={{ timeout: 0 }} placement="bottom">
                        <IconButton
                            id={toolSelector === tool.CIRCLE ? "iconButtonActive" : "iconButton"}
                            variant="contained"
                            onClick={toolSelector === tool.CIRCLE ? 
                                () => setDisplayExtraTools(false)
                                : 
                                () => store.dispatch(setTool(tool.CIRCLE))
                            }>
                            <RadioButtonUncheckedIcon id={toolSelector === tool.CIRCLE ? "iconButtonActiveInner" : "iconButtonInner"} />
                        </IconButton>
                    </Tooltip>
                </div>
            ) : null}
            <div>
                <Tooltip id="tooltip" title="choose color" TransitionProps={{ timeout: 0 }} placement="bottom">
                    <IconButton id="iconButton" variant="contained" onClick={handlePaletteClick}>
                        <PaletteIcon id="iconButtonInner" />
                    </IconButton>
                </Tooltip>
                {
                    // Palette Popup
                    displayColorPicker ? (
                        <div className="popup">
                            <div
                                className="cover"
                                onClick={handlePaletteClose}
                            />
                            <div className="colorpicker">
                                <SketchPicker
                                    disableAlpha={true}
                                    color={colorSelector}
                                    onChange={handlePaletteChange}
                                />
                            </div>
                        </div>
                    ) : null
                }
            </div>
            <div>
                <Tooltip id="tooltip" title="choose width" TransitionProps={{ timeout: 0 }} placement="bottom">
                    <IconButton id="iconButton" variant="contained" onClick={handleWidthClick}>
                        <CreateIcon id="iconButtonInner" />
                    </IconButton>
                </Tooltip>
                {
                    // Width Slider Popup
                    displayWidthPicker ? (
                        <div className="popup">
                            <div className="cover" onClick={handleWidthClose} />
                            <div className="widthpicker">
                                <Slider
                                    value={
                                        typeof widthSelector === "number"
                                            ? widthSelector
                                            : 0
                                    }
                                    onChange={handleSliderChange}
                                    aria-labelledby="input-slider"
                                    min={WIDTH_MIN}
                                    max={WIDTH_MAX}
                                />
                                <Input
                                    value={widthSelector}
                                    margin="dense"
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    inputProps={{
                                        step: WIDTH_STEP,
                                        min: WIDTH_MIN,
                                        max: WIDTH_MAX,
                                        type: "number",
                                        "aria-labelledby": "input-slider",
                                    }}
                                />
                            </div>
                        </div>
                    ) : null
                }
            </div>
        </div>
    )
}
export default Toolbar
