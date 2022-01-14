import { FormattedMessage } from "language"
import React from "react"
import { IconButton, Position, RedoIcon, ToolTip, UndoIcon } from "components"
import { handleRedo, handleUndo } from "drawing/handlers"
import { useCustomSelector } from "hooks"

const UndoRedo: React.FC = () => {
    const disableUndoStack = useCustomSelector(
        (state) => state.board.undoStack?.length === 0
    )
    const disableRedoStack = useCustomSelector(
        (state) => state.board.redoStack?.length === 0
    )
    return (
        <>
            <ToolTip
                position={Position.Bottom}
                text={<FormattedMessage id="ToolBar.Undo" />}
            >
                <IconButton deactivated={disableUndoStack} onClick={handleUndo}>
                    <UndoIcon />
                </IconButton>
            </ToolTip>
            <ToolTip
                position={Position.Bottom}
                text={<FormattedMessage id="ToolBar.Redo" />}
            >
                <IconButton deactivated={disableRedoStack} onClick={handleRedo}>
                    <RedoIcon />
                </IconButton>
            </ToolTip>
        </>
    )
}

export default UndoRedo
