import React from "react"
import { MdRedo, MdUndo } from "react-icons/md"
import { useSelector } from "react-redux"
import { REDO, UNDO } from "../../../redux/slice/boardcontrol"
import store from "../../../redux/store"

export default function UndoRedo() {
    const displayUndo = useSelector(
        (state) => state.boardControl.undoStack.length !== 0
    )
    const displayRedo = useSelector(
        (state) => state.boardControl.redoStack.length !== 0
    )

    return (
        <div>
            <button
                type="button"
                id="icon-button"
                onClick={() => {
                    store.dispatch(UNDO())
                }}>
                {displayUndo ? <MdUndo id="icon" /> : null}
            </button>

            <button
                type="button"
                id="icon-button"
                onClick={() => {
                    store.dispatch(REDO())
                }}>
                {displayRedo ? <MdRedo id="icon" /> : null}
            </button>
        </div>
    )
}
