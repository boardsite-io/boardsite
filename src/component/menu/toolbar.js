import React, { useState } from "react"
import { IconButton } from "@material-ui/core"
import PaletteIcon from "@material-ui/icons/Palette"
import CreateIcon from "@material-ui/icons/Create"
import { SketchPicker } from "react-color"
import RemoveIcon from "@material-ui/icons/Remove"
import ChangeHistoryIcon from "@material-ui/icons/ChangeHistory"
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked"
import BrushIcon from "@material-ui/icons/Brush"
import HighlightOffIcon from "@material-ui/icons/HighlightOff"
import Tooltip from "@material-ui/core/Tooltip"
import ControlCameraIcon from "@material-ui/icons/ControlCamera"
import { useSelector } from "react-redux"
import WidthSlider from "./widthslider"

import store from "../../redux/store"
import { setColor, setType } from "../../redux/slice/drawcontrol"
import { toolType } from "../../constants"
import UndoRedo from "./undoredo"

function Toolbar() {
    const [displayColorPicker, setDisplayColorPicker] = useState(false)
    const [displayWidthPicker, setDisplayWidthPicker] = useState(false)
    const [displayExtraTools, setDisplayExtraTools] = useState(false)
    const typeSelector = useSelector(
        (state) => state.drawControl.liveStroke.type
    )
    const colorSelector = useSelector(
        (state) => state.drawControl.liveStroke.style.color
    )
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

    function debug() {
        // console.log("debug")
    }

    return (
        <div className="toolbar">
            <IconButton
                id="iconButton"
                style={{ backgroundColor: "grey" }}
                onClick={debug}>
                D
            </IconButton>
            <UndoRedo />
            <div className="toolring">
                <Tooltip
                    id="tooltip"
                    title="Pen (1 or P)"
                    TransitionProps={{ timeout: 0 }}
                    placement="bottom">
                    <IconButton
                        id={
                            typeSelector === toolType.PEN
                                ? "iconButtonActive"
                                : "iconButton"
                        }
                        variant="contained"
                        onClick={
                            typeSelector === toolType.PEN
                                ? () => setDisplayExtraTools((prev) => !prev)
                                : () => {
                                      setDisplayExtraTools(false)
                                      store.dispatch(setType(toolType.PEN))
                                  }
                        }>
                        <BrushIcon
                            id={
                                typeSelector === toolType.PEN
                                    ? "iconButtonActiveInner"
                                    : "iconButtonInner"
                            }
                        />
                    </IconButton>
                </Tooltip>
                <Tooltip
                    id="tooltip"
                    title="Eraser (2 or E)"
                    TransitionProps={{ timeout: 0 }}
                    placement="bottom">
                    <IconButton
                        id={
                            typeSelector === toolType.ERASER
                                ? "iconButtonActive"
                                : "iconButton"
                        }
                        variant="contained"
                        onClick={() => {
                            store.dispatch(setType(toolType.ERASER))
                        }}>
                        <HighlightOffIcon
                            id={
                                typeSelector === toolType.ERASER
                                    ? "iconButtonActiveInner"
                                    : "iconButtonInner"
                            }
                        />
                    </IconButton>
                </Tooltip>
                <Tooltip
                    id="tooltip"
                    title="Drag (3 or D)"
                    TransitionProps={{ timeout: 0 }}
                    placement="bottom">
                    <IconButton
                        id={isDraggable ? "iconButtonActive" : "iconButton"}
                        variant="contained"
                        onClick={() => {
                            store.dispatch(setType(toolType.DRAG))
                        }}>
                        <ControlCameraIcon
                            id={
                                isDraggable
                                    ? "iconButtonActiveInner"
                                    : "iconButtonInner"
                            }
                        />
                    </IconButton>
                </Tooltip>
            </div>
            {displayExtraTools ? (
                <div className="extratools">
                    <Tooltip
                        id="tooltip"
                        title="Line (4 or L)"
                        TransitionProps={{ timeout: 0 }}
                        placement="bottom">
                        <IconButton
                            id={
                                typeSelector === toolType.LINE
                                    ? "iconButtonActive"
                                    : "iconButton"
                            }
                            variant="contained"
                            onClick={
                                typeSelector === toolType.LINE
                                    ? () => {
                                          setDisplayExtraTools(false)
                                      }
                                    : () => {
                                          store.dispatch(setType(toolType.LINE))
                                      }
                            }>
                            <RemoveIcon
                                id={
                                    typeSelector === toolType.LINE
                                        ? "iconButtonActiveInner"
                                        : "iconButtonInner"
                                }
                            />
                        </IconButton>
                    </Tooltip>
                    <Tooltip
                        id="tooltip"
                        title="Triangle (5 or T)"
                        TransitionProps={{ timeout: 0 }}
                        placement="bottom">
                        <IconButton
                            id={
                                typeSelector === toolType.TRIANGLE
                                    ? "iconButtonActive"
                                    : "iconButton"
                            }
                            variant="contained"
                            onClick={
                                typeSelector === toolType.TRIANGLE
                                    ? () => {
                                          setDisplayExtraTools(false)
                                      }
                                    : () => {
                                          store.dispatch(
                                              setType(toolType.TRIANGLE)
                                          )
                                      }
                            }>
                            <ChangeHistoryIcon
                                id={
                                    typeSelector === toolType.TRIANGLE
                                        ? "iconButtonActiveInner"
                                        : "iconButtonInner"
                                }
                            />
                        </IconButton>
                    </Tooltip>
                    <Tooltip
                        id="tooltip"
                        title="Circle (6 or C)"
                        TransitionProps={{ timeout: 0 }}
                        placement="bottom">
                        <IconButton
                            id={
                                typeSelector === toolType.CIRCLE
                                    ? "iconButtonActive"
                                    : "iconButton"
                            }
                            variant="contained"
                            onClick={
                                typeSelector === toolType.CIRCLE
                                    ? () => {
                                          setDisplayExtraTools(false)
                                      }
                                    : () => {
                                          store.dispatch(
                                              setType(toolType.CIRCLE)
                                          )
                                      }
                            }>
                            <RadioButtonUncheckedIcon
                                id={
                                    typeSelector === toolType.CIRCLE
                                        ? "iconButtonActiveInner"
                                        : "iconButtonInner"
                                }
                            />
                        </IconButton>
                    </Tooltip>
                </div>
            ) : null}
            <div>
                <Tooltip
                    id="tooltip"
                    title="Color"
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
                            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                            <div
                                className="cover"
                                onClick={handlePaletteClose}
                                onKeyPress={() => {}}
                            />
                            <div className="colorpicker">
                                <SketchPicker
                                    disableAlpha
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
                    title="Width"
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
                            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                            <div
                                className="cover"
                                onClick={handleWidthClose}
                                onKeyPress={() => {}}
                            />
                            <WidthSlider />
                        </div>
                    ) : null
                }
            </div>
        </div>
    )
}
export default Toolbar
