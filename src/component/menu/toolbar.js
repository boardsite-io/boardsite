import React, { useState } from "react"
import { IconButton } from "@material-ui/core"
import RemoveIcon from "@material-ui/icons/Remove"
import ChangeHistoryIcon from "@material-ui/icons/ChangeHistory"
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked"
import BrushIcon from "@material-ui/icons/Brush"
import HighlightOffIcon from "@material-ui/icons/HighlightOff"
import Tooltip from "@material-ui/core/Tooltip"
import ControlCameraIcon from "@material-ui/icons/ControlCamera"
import { useSelector } from "react-redux"
import WidthPicker from "./widthpicker"
import ColorPicker from "./colorpicker"
import store from "../../redux/store"
import { SET_TYPE } from "../../redux/slice/drawcontrol"
import { toolType } from "../../constants"
import UndoRedo from "./undoredo"

function Toolbar() {
    // console.log("Toolbar Redraw")
    const [displayExtraTools, setDisplayExtraTools] = useState(false)
    const typeSelector = useSelector(
        (state) => state.drawControl.liveStroke.type
    )
    const isDraggable = useSelector((state) => state.drawControl.isDraggable)

    return (
        <div className="toolbar">
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
                                      store.dispatch(SET_TYPE(toolType.PEN))
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
                            store.dispatch(SET_TYPE(toolType.ERASER))
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
                            store.dispatch(SET_TYPE(toolType.DRAG))
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
                                          store.dispatch(
                                              SET_TYPE(toolType.LINE)
                                          )
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
                                              SET_TYPE(toolType.TRIANGLE)
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
                                              SET_TYPE(toolType.CIRCLE)
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
            <ColorPicker />
            <WidthPicker />
        </div>
    )
}
export default Toolbar
