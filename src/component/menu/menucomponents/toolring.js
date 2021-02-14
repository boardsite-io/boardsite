import React, { useState } from "react"
import { useSelector } from "react-redux"
import {
    MdBrush,
    MdChangeHistory,
    MdHighlightOff,
    MdRadioButtonUnchecked,
    MdRemove,
} from "react-icons/md"
import { RiDragMoveFill } from "react-icons/ri"
import store from "../../../redux/store"
import { SET_TYPE } from "../../../redux/slice/drawcontrol"
import { toolType } from "../../../constants"

export default function ToolRing() {
    const [displayExtraTools, setDisplayExtraTools] = useState(false)
    const typeSelector = useSelector(
        (state) => state.drawControl.liveStroke.type
    )

    return (
        <>
            <div className="toolring">
                {typeSelector === toolType.PEN ? (
                    <button
                        type="button"
                        id="icon-button-active"
                        onClick={() => setDisplayExtraTools((prev) => !prev)}>
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
            </div>
            {displayExtraTools ? (
                <div className="extratools">
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
                </div>
            ) : null}
        </>
    )
}
