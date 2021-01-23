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
import ControlCameraIcon from '@material-ui/icons/ControlCamera';

import store from "../../redux/store.js"
import { useSelector } from "react-redux"
import { setColor, setWidth, setType, setIsDraggable } from "../../redux/slice/drawcontrol.js"
import { type, WIDTH_MIN, WIDTH_MAX, WIDTH_STEP } from "../../constants.js"

import UndoRedo from './undoredo'

function Toolbar() {
    const [displayColorPicker, setDisplayColorPicker] = useState(false)
    const [displayWidthPicker, setDisplayWidthPicker] = useState(false)
    const [displayExtraTools, setDisplayExtraTools] = useState(false)
    const typeSelector = useSelector(state => state.drawControl.liveStroke.type)
    const widthSelector = useSelector(state => state.drawControl.liveStroke.style.width)
    const colorSelector = useSelector(state => state.drawControl.liveStroke.style.color)
    const isDraggable = useSelector((state) => state.drawControl.isDraggable)

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

    function debug() {
        console.log("debug");
    }

    return (
        <div className="toolbar">
            <IconButton id="iconButton" style={{ backgroundColor: "grey" }} onClick={debug}>
                D
            </IconButton>
            <UndoRedo />
            <div className="toolring">
                <Tooltip id="tooltip" title="Pen (P)" TransitionProps={{ timeout: 0 }} placement="bottom">
                    <IconButton
                        id={typeSelector === type.PEN ? "iconButtonActive" : "iconButton"}
                        variant="contained"
                        onClick={typeSelector === type.PEN ?
                            () => setDisplayExtraTools((prev) => !prev)
                            :
                            () => {
                                setDisplayExtraTools(false)
                                store.dispatch(setType(type.PEN))
                                store.dispatch(setIsDraggable(false))
                            }
                        }>
                        <BrushIcon id={typeSelector === type.PEN ? "iconButtonActiveInner" : "iconButtonInner"} />
                    </IconButton>
                </Tooltip>
                <Tooltip id="tooltip" title="Eraser (E)" TransitionProps={{ timeout: 0 }} placement="bottom">
                    <IconButton
                        id={typeSelector === type.ERASER ? "iconButtonActive" : "iconButton"}
                        variant="contained"
                        onClick={() => {
                            store.dispatch(setType(type.ERASER))
                            store.dispatch(setIsDraggable(false))
                        }}>
                        <HighlightOffIcon id={typeSelector === type.ERASER ? "iconButtonActiveInner" : "iconButtonInner"} />
                    </IconButton>
                </Tooltip>
                <Tooltip id="tooltip" title="Drag (D)" TransitionProps={{ timeout: 0 }} placement="bottom">
                    <IconButton
                        id={isDraggable ? "iconButtonActive" : "iconButton"}
                        variant="contained"
                        onClick={() => {
                            store.dispatch(setType(type.DRAG))
                            store.dispatch(setIsDraggable(true))
                        }}>
                        <ControlCameraIcon id={isDraggable ? "iconButtonActiveInner" : "iconButtonInner"} />
                    </IconButton>
                </Tooltip>
            </div>
            {displayExtraTools ? (
                <div className="extratools">
                    <Tooltip id="tooltip" title="Line" TransitionProps={{ timeout: 0 }} placement="bottom">
                        <IconButton
                            id={typeSelector === type.LINE ? "iconButtonActive" : "iconButton"}
                            variant="contained"
                            onClick={typeSelector === type.LINE ?
                                () => {
                                    setDisplayExtraTools(false)
                                }
                                :
                                () => {
                                    store.dispatch(setType(type.LINE))
                                    store.dispatch(setIsDraggable(false))
                                } 
                            }>
                            <RemoveIcon id={typeSelector === type.LINE ? "iconButtonActiveInner" : "iconButtonInner"} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip id="tooltip" title="Triangle" TransitionProps={{ timeout: 0 }} placement="bottom">
                        <IconButton
                            id={typeSelector === type.TRIANGLE ? "iconButtonActive" : "iconButton"}
                            variant="contained"
                            onClick={typeSelector === type.TRIANGLE ?
                                () => {
                                    setDisplayExtraTools(false)
                                }
                                :
                                () => {
                                    store.dispatch(setType(type.TRIANGLE))
                                    store.dispatch(setIsDraggable(false))
                                } 
                            }>
                            <ChangeHistoryIcon id={typeSelector === type.TRIANGLE ? "iconButtonActiveInner" : "iconButtonInner"} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip id="tooltip" title="Circle" TransitionProps={{ timeout: 0 }} placement="bottom">
                        <IconButton
                            id={typeSelector === type.CIRCLE ? "iconButtonActive" : "iconButton"}
                            variant="contained"
                            onClick={typeSelector === type.CIRCLE ?
                                () => {
                                    setDisplayExtraTools(false)
                                } 
                                :
                                () => {
                                    store.dispatch(setType(type.CIRCLE))
                                    store.dispatch(setIsDraggable(false))
                                } 
                            }>
                            <RadioButtonUncheckedIcon id={typeSelector === type.CIRCLE ? "iconButtonActiveInner" : "iconButtonInner"} />
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
