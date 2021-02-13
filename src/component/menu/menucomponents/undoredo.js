import React from "react"
import { ActionCreators as UndoActionCreators } from "redux-undo"
// import { useSelector } from "react-redux"
import { MdRedo, MdUndo } from "react-icons/md"
import Tooltip from "@material-ui/core/Tooltip"
import store from "../../../redux/store"

export default function UndoRedo() {
    // const canUndo = useSelector((state) => state.boardControl.past.length > 0)
    // const canRedo = useSelector((state) => state.boardControl.future.length > 0)

    return (
        <>
            <Tooltip
                id="tooltip"
                title="Undo (Ctrl + Z)"
                TransitionProps={{ timeout: 0 }}
                placement="bottom">
                <button
                    type="button"
                    id="icon-button"
                    // disabled={!canUndo}
                    onClick={() => {
                        store.dispatch(UndoActionCreators.undo())
                    }}>
                    <MdUndo id="icon" />
                </button>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="Redo (Ctrl + Y)"
                TransitionProps={{ timeout: 0 }}
                placement="bottom">
                <button
                    type="button"
                    id="icon-button"
                    // disabled={!canRedo}
                    onClick={() => {
                        store.dispatch(UndoActionCreators.redo())
                    }}>
                    <MdRedo id="icon" />
                </button>
            </Tooltip>
        </>
    )
}
