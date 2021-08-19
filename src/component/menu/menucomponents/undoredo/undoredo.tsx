import React from "react"
import { MdRedo, MdUndo } from "react-icons/md"
import { handleUndo, handleRedo } from "../../../../drawing/handlers"
import IconButton from "../iconbutton/iconbutton"

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
