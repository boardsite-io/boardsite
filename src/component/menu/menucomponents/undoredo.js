import React from "react"
import { MdRedo, MdUndo } from "react-icons/md"
import { useSelector } from "react-redux"
import { handleUndo, handleRedo } from "../../board/request_handlers"

export default function UndoRedo() {
    const displayUndo = useSelector(
        (state) => state.boardControl.undoStack.length !== 0
    )
    const displayRedo = useSelector(
        (state) => state.boardControl.redoStack.length !== 0
    )

    return (
        <div>
            <button type="button" id="icon-button" onClick={handleUndo}>
                {displayUndo ? <MdUndo id="icon" /> : null}
            </button>

            <button type="button" id="icon-button" onClick={handleRedo}>
                {displayRedo ? <MdRedo id="icon" /> : null}
            </button>
        </div>
    )
}
