import React, { useState } from "react"
import { IconButton, Input, Slider } from "@material-ui/core"
import PaletteIcon from "@material-ui/icons/Palette"
import CreateIcon from "@material-ui/icons/Create"
import UndoIcon from "@material-ui/icons/Undo"
import RedoIcon from "@material-ui/icons/Redo"
import { SketchPicker } from "react-color"
import RemoveIcon from "@material-ui/icons/Remove"
import ChangeHistoryIcon from "@material-ui/icons/ChangeHistory"
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked"
import BrushIcon from "@material-ui/icons/Brush"
import HighlightOffIcon from "@material-ui/icons/HighlightOff"
import Tooltip from "@material-ui/core/Tooltip"

import store from "../../redux/store.js"
import { setColor, setWidth, setTool } from "../../redux/slice/drawcontrol.js"

import * as constant from "../../constants.js"

function Toolbar(props) {
    const [displayColorPicker, setDisplayColorPicker] = useState(false)
    const [displayWidthPicker, setDisplayWidthPicker] = useState(false)
    const [displayExtraTools, setDisplayExtraTools] = useState(false)
    const [colorDisplay, setColorDisplay] = useState(constant.DEFAULT_COLOR)
    const [lineWidth, setLineWidth] = useState(constant.DEFAULT_WIDTH)
    const [activeTool, setActiveTool] = useState(constant.DEFAULT_TOOL)

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
        setColorDisplay(color.rgb)
        store.dispatch(setColor(color.hex))
    }

    const handleSliderChange = (event, width) => {
        setLineWidth(width)
        store.dispatch(setWidth(width * constant.CANVAS_PIXEL_RATIO))
    }

    const handleInputChange = (event) => {
        const width =
            event.target.value === "" ? "" : Number(event.target.value)
        setLineWidth(width)
        store.dispatch(setWidth(width * constant.CANVAS_PIXEL_RATIO))
    }

    // Slider Functions
    const handleBlur = () => {
        if (lineWidth < constant.WIDTH_MIN) {
            setLineWidth(constant.WIDTH_MIN)
        } else if (lineWidth > constant.WIDTH_MAX) {
            setLineWidth(constant.WIDTH_MAX)
        }
    }

    return (
        <div className="toolbar">
            <IconButton
                id="iconButton"
                style={{ backgroundColor: "grey" }}
                onClick={props.debug}>
                D
            </IconButton>

            <Tooltip
                id="tooltip"
                title="undo"
                TransitionProps={{ timeout: 0 }}
                placement="bottom">
                <IconButton
                    id="iconButton"
                    variant="contained"
                    onClick={props.handleUndo}>
                    <UndoIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="redo"
                TransitionProps={{ timeout: 0 }}
                placement="bottom">
                <IconButton
                    id="iconButton"
                    variant="contained"
                    onClick={props.handleRedo}>
                    <RedoIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            <div className="toolring">
                <Tooltip
                    id="tooltip"
                    title="pen"
                    TransitionProps={{ timeout: 0 }}
                    placement="bottom">
                    {activeTool === "pen" ? (
                        <IconButton
                            id="iconButtonActive"
                            variant="contained"
                            onClick={() =>
                                setDisplayExtraTools((prev) => !prev)
                            }>
                            <BrushIcon id="iconButtonActiveInner" />
                        </IconButton>
                    ) : (
                        <IconButton
                            id="iconButton"
                            variant="contained"
                            onClick={() => {
                                setActiveTool("pen")
                                setDisplayExtraTools(false)
                                store.dispatch(setTool("pen"))
                            }}>
                            <BrushIcon id="iconButtonInner" />
                        </IconButton>
                    )}
                </Tooltip>
                <Tooltip
                    id="tooltip"
                    title="eraser"
                    TransitionProps={{ timeout: 0 }}
                    placement="bottom">
                    {activeTool === "eraser" ? (
                        <IconButton
                            id="iconButtonActive"
                            variant="contained"
                            onClick={() => setActiveTool("eraser")}>
                            <HighlightOffIcon id="iconButtonActiveInner" />
                        </IconButton>
                    ) : (
                        <IconButton
                            id="iconButton"
                            variant="contained"
                            onClick={() => {
                                setActiveTool("eraser")
                                store.dispatch(setTool("eraser"))
                            }}>
                            <HighlightOffIcon id="iconButtonInner" />
                        </IconButton>
                    )}
                </Tooltip>
            </div>
            {displayExtraTools ? (
                <div className="extratools">
                    <Tooltip
                        id="tooltip"
                        title="line"
                        TransitionProps={{ timeout: 0 }}
                        placement="bottom">
                        {activeTool === "line" ? (
                            <IconButton
                                id="iconButtonActive"
                                variant="contained"
                                onClick={() => setDisplayExtraTools(false)}>
                                <RemoveIcon id="iconButtonActiveInner" />
                            </IconButton>
                        ) : (
                            <IconButton
                                id="iconButton"
                                variant="contained"
                                onClick={() => {
                                    setActiveTool("line")
                                    store.dispatch(setTool("line"))
                                }}>
                                <RemoveIcon id="iconButtonInner" />
                            </IconButton>
                        )}
                    </Tooltip>
                    <Tooltip
                        id="tooltip"
                        title="triangle"
                        TransitionProps={{ timeout: 0 }}
                        placement="bottom">
                        {activeTool === "triangle" ? (
                            <IconButton
                                id="iconButtonActive"
                                variant="contained"
                                onClick={() => setDisplayExtraTools(false)}>
                                <ChangeHistoryIcon id="iconButtonActiveInner" />
                            </IconButton>
                        ) : (
                            <IconButton
                                id="iconButton"
                                variant="contained"
                                onClick={() => {
                                    setActiveTool("triangle")
                                    store.dispatch(setTool("triangle"))
                                }}>
                                <ChangeHistoryIcon id="iconButtonInner" />
                            </IconButton>
                        )}
                    </Tooltip>
                    <Tooltip
                        id="tooltip"
                        title="circle"
                        TransitionProps={{ timeout: 0 }}
                        placement="bottom">
                        {activeTool === "circle" ? (
                            <IconButton
                                id="iconButtonActive"
                                variant="contained"
                                onClick={() => setDisplayExtraTools(false)}>
                                <RadioButtonUncheckedIcon id="iconButtonActiveInner" />
                            </IconButton>
                        ) : (
                            <IconButton
                                id="iconButton"
                                variant="contained"
                                onClick={() => {
                                    setActiveTool("circle")
                                    store.dispatch(setTool("circle"))
                                }}>
                                <RadioButtonUncheckedIcon id="iconButtonInner" />
                            </IconButton>
                        )}
                    </Tooltip>
                </div>
            ) : null}
            <div>
                <Tooltip
                    id="tooltip"
                    title="choose color"
                    TransitionProps={{ timeout: 0 }}
                    placement="bottom">
                    <IconButton
                        id="iconButton"
                        variant="contained"
                        onClick={handlePaletteClick}>
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
                                    color={colorDisplay}
                                    onChange={handlePaletteChange}
                                />
                            </div>
                        </div>
                    ) : null
                }
            </div>
            <div>
                <Tooltip
                    id="tooltip"
                    title="choose width"
                    TransitionProps={{ timeout: 0 }}
                    placement="bottom">
                    <IconButton
                        id="iconButton"
                        variant="contained"
                        onClick={handleWidthClick}>
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
                                        typeof lineWidth === "number"
                                            ? lineWidth
                                            : 0
                                    }
                                    onChange={handleSliderChange}
                                    aria-labelledby="input-slider"
                                    min={constant.WIDTH_MIN}
                                    max={constant.WIDTH_MAX}
                                />
                                <Input
                                    value={lineWidth}
                                    margin="dense"
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    inputProps={{
                                        step: constant.WIDTH_STEP,
                                        min: constant.WIDTH_MIN,
                                        max: constant.WIDTH_MAX,
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
