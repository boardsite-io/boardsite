import { IconButton, RedoIcon, UndoIcon } from "components"
import { handleRedo, handleUndo } from "drawing/handlers"
import React from "react"
import { useCustomSelector } from "redux/hooks"

const UndoRedo: React.FC = () => {
    const disableUndoStack = useCustomSelector(
        (state) => state.board.undoStack?.length === 0
    )
    const disableRedoStack = useCustomSelector(
        (state) => state.board.redoStack?.length === 0
    )
    return (
        <>
            <IconButton deactivated={disableUndoStack} onClick={handleUndo}>
                <UndoIcon />
            </IconButton>
            <IconButton deactivated={disableRedoStack} onClick={handleRedo}>
                <RedoIcon />
            </IconButton>
        </>
    )
}

export default UndoRedo
