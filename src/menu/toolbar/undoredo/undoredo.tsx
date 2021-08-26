import { IconButton } from "@components"
import { handleRedo, handleUndo } from "drawing/handlers"
import React from "react"
import { MdRedo, MdUndo } from "react-icons/md"

const UndoRedo: React.FC = () => (
    <>
        <IconButton onClick={handleUndo}>
            <MdUndo id="icon" />
        </IconButton>
        <IconButton onClick={handleRedo}>
            <MdRedo id="icon" />
        </IconButton>
    </>
)

export default UndoRedo
