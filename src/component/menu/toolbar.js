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
import { useSelector } from "react-redux"
import { setColor, setWidth, setTool } from "../../redux/slice/drawcontrol.js"
import { tool, WIDTH_MIN, WIDTH_MAX, WIDTH_STEP } from "../../constants.js"

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
                    title="Pen"
                    TransitionProps={{ timeout: 0 }}
                    placement="bottom">
                    {toolSelector === tool.PEN ? (
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
                                setDisplayExtraTools(false)
                                store.dispatch(setTool(tool.PEN))
                            }}>
                            <BrushIcon id="iconButtonInner" />
                        </IconButton>
                    )}
                </Tooltip>
                <Tooltip
                    id="tooltip"
                    title="Eraser"
                    TransitionProps={{ timeout: 0 }}
                    placement="bottom">
                    {toolSelector === tool.ERASER ? (
                        <IconButton
                            id="iconButtonActive"
                            variant="contained"
                            onClick={() => store.dispatch(setTool(tool.ERASER))}>
                            <HighlightOffIcon id="iconButtonActiveInner" />
                        </IconButton>
                    ) : (
                        <IconButton
                            id="iconButton"
                            variant="contained"
                            onClick={() => {
                                store.dispatch(setTool(tool.ERASER))
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
                        title="Line"
                        TransitionProps={{ timeout: 0 }}
                        placement="bottom">
                        {toolSelector === tool.LINE ? (
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
                                    store.dispatch(setTool(tool.LINE))
                                }}>
                                <RemoveIcon id="iconButtonInner" />
                            </IconButton>
                        )}
                    </Tooltip>
                    <Tooltip
                        id="tooltip"
                        title="Triangle"
                        TransitionProps={{ timeout: 0 }}
                        placement="bottom">
                        {toolSelector === tool.TRIANGLE ? (
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
                                    store.dispatch(setTool(tool.TRIANGLE))
                                }}>
                                <ChangeHistoryIcon id="iconButtonInner" />
                            </IconButton>
                        )}
                    </Tooltip>
                    <Tooltip
                        id="tooltip"
                        title="Circle"
                        TransitionProps={{ timeout: 0 }}
                        placement="bottom">
                        {toolSelector === tool.CIRCLE ? (
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
                                    store.dispatch(setTool(tool.CIRCLE))
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
                                    color={colorSelector}
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
