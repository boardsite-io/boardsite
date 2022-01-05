import { IconButton, Position, RedoIcon, ToolTip, UndoIcon } from "components"
import { handleRedo, handleUndo } from "drawing/handlers"
import React from "react"
import { useCustomSelector } from "hooks"
import { ToolTipText } from "language"

const UndoRedo: React.FC = () => {
    const disableUndoStack = useCustomSelector(
        (state) => state.board.undoStack?.length === 0
    )
    const disableRedoStack = useCustomSelector(
        (state) => state.board.redoStack?.length === 0
    )
    return (
        <>
            <ToolTip position={Position.Bottom} text={ToolTipText.Undo}>
                <IconButton deactivated={disableUndoStack} onClick={handleUndo}>
                    <UndoIcon />
                </IconButton>
            </ToolTip>
            <ToolTip position={Position.Bottom} text={ToolTipText.Redo}>
                <IconButton deactivated={disableRedoStack} onClick={handleRedo}>
                    <RedoIcon />
                </IconButton>
            </ToolTip>
        </>
    )
}

export default UndoRedo
