import { IconButton, RedoIcon, UndoIcon } from "components"
import { handleRedo, handleUndo } from "drawing/handlers"
import React from "react"

const UndoRedo: React.FC = () => (
    <>
        <IconButton onClick={handleUndo}>
            <UndoIcon />
        </IconButton>
        <IconButton onClick={handleRedo}>
            <RedoIcon />
        </IconButton>
    </>
)

export default UndoRedo
