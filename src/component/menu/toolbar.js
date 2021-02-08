import React, { useState } from "react"
import {
    MdBrush,
    MdChangeHistory,
    MdHighlightOff,
    MdRadioButtonUnchecked,
    MdRemove,
} from "react-icons/md"
import { RiDragMoveFill } from "react-icons/ri"
import Tooltip from "@material-ui/core/Tooltip"
import { useSelector } from "react-redux"
import WidthPicker from "./widthpicker"
import ColorPicker from "./colorpicker"
import store from "../../redux/store"
import { SET_TYPE } from "../../redux/slice/drawcontrol"
import { toolType } from "../../constants"
import UndoRedo from "./undoredo"

function Toolbar() {
    const [displayExtraTools, setDisplayExtraTools] = useState(false)
    const typeSelector = useSelector(
        (state) => state.drawControl.liveStroke.type
    )

    return (
        <div className="toolbar">
            <UndoRedo />
            <div className="toolring">
                <Tooltip
                    id="tooltip"
                    title="Pen (1 or P)"
                    TransitionProps={{ timeout: 0 }}
                    placement="bottom">
                    {typeSelector === toolType.PEN ? (
                        <button
                            type="button"
                            id="icon-button-active"
                            onClick={() =>
                                setDisplayExtraTools((prev) => !prev)
                            }>
                            <MdBrush id="icon" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            id="icon-button"
                            onClick={() => {
                                setDisplayExtraTools(false)
                                store.dispatch(SET_TYPE(toolType.PEN))
                            }}>
                            <MdBrush id="icon" />
                        </button>
                    )}
                </Tooltip>
                <Tooltip
                    id="tooltip"
                    title="Eraser (2 or E)"
                    TransitionProps={{ timeout: 0 }}
                    placement="bottom">
                    {typeSelector === toolType.ERASER ? (
                        <button
                            type="button"
                            id="icon-button-active"
                            onClick={() => {
                                store.dispatch(SET_TYPE(toolType.ERASER))
                            }}>
                            <MdHighlightOff id="icon" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            id="icon-button"
                            onClick={() => {
                                store.dispatch(SET_TYPE(toolType.ERASER))
                            }}>
                            <MdHighlightOff id="icon" />
                        </button>
                    )}
                </Tooltip>
                <Tooltip
                    id="tooltip"
                    title="Drag (3 or D)"
                    TransitionProps={{ timeout: 0 }}
                    placement="bottom">
                    {typeSelector === toolType.DRAG ? (
                        <button
                            type="button"
                            id="icon-button-active"
                            onClick={() => {
                                store.dispatch(SET_TYPE(toolType.DRAG))
                            }}>
                            <RiDragMoveFill id="icon" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            id="icon-button"
                            onClick={() => {
                                store.dispatch(SET_TYPE(toolType.DRAG))
                            }}>
                            <RiDragMoveFill id="icon" />
                        </button>
                    )}
                </Tooltip>
            </div>
            {displayExtraTools ? (
                <div className="extratools">
                    <Tooltip
                        id="tooltip"
                        title="Line (4 or L)"
                        TransitionProps={{ timeout: 0 }}
                        placement="bottom">
                        {typeSelector === toolType.LINE ? (
                            <button
                                type="button"
                                id="icon-button-active"
                                onClick={() => {
                                    setDisplayExtraTools(false)
                                }}>
                                <MdRemove id="icon" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                id="icon-button"
                                onClick={() => {
                                    store.dispatch(SET_TYPE(toolType.LINE))
                                }}>
                                <MdRemove id="icon" />
                            </button>
                        )}
                    </Tooltip>
                    <Tooltip
                        id="tooltip"
                        title="Triangle (5 or T)"
                        TransitionProps={{ timeout: 0 }}
                        placement="bottom">
                        {typeSelector === toolType.TRIANGLE ? (
                            <button
                                type="button"
                                id="icon-button-active"
                                onClick={() => {
                                    setDisplayExtraTools(false)
                                }}>
                                <MdChangeHistory id="icon" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                id="icon-button"
                                onClick={() => {
                                    store.dispatch(SET_TYPE(toolType.TRIANGLE))
                                }}>
                                <MdChangeHistory id="icon" />
                            </button>
                        )}
                    </Tooltip>
                    <Tooltip
                        id="tooltip"
                        title="Circle (6 or C)"
                        TransitionProps={{ timeout: 0 }}
                        placement="bottom">
                        {typeSelector === toolType.CIRCLE ? (
                            <button
                                type="button"
                                id="icon-button-active"
                                onClick={() => {
                                    setDisplayExtraTools(false)
                                }}>
                                <MdRadioButtonUnchecked id="icon" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                id="icon-button"
                                onClick={() => {
                                    store.dispatch(SET_TYPE(toolType.CIRCLE))
                                }}>
                                <MdRadioButtonUnchecked id="icon" />
                            </button>
                        )}
                    </Tooltip>
                </div>
            ) : null}
            <ColorPicker />
            <WidthPicker />
        </div>
    )
}
export default Toolbar
