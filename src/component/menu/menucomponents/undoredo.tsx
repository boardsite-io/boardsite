import React from "react"
import { MdRedo, MdUndo } from "react-icons/md"
import { handleUndo, handleRedo } from "../../../drawing/handlers"

export default function UndoRedo() {
    return (
        <div>
            <button type="button" id="icon-button" onClick={handleUndo}>
                <MdUndo id="icon" />
            </button>

            <button type="button" id="icon-button" onClick={handleRedo}>
                <MdRedo id="icon" />
            </button>
        </div>
    )
}
