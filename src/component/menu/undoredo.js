import React from "react"
import { ActionCreators as UndoActionCreators } from "redux-undo"
import { useSelector } from "react-redux"
import UndoIcon from "@material-ui/icons/Undo"
import RedoIcon from "@material-ui/icons/Redo"
import Tooltip from "@material-ui/core/Tooltip"
import { IconButton } from "@material-ui/core"
import store from "../../redux/store"

export default function UndoRedo() {
    const canUndo = useSelector((state) => state.boardControl.past.length > 0)
    const canRedo = useSelector((state) => state.boardControl.future.length > 0)

    return (
        <>
            <Tooltip
                id="tooltip"
                title="Undo (Ctrl + Z)"
                TransitionProps={{ timeout: 0 }}
                placement="bottom">
                <span>
                    <IconButton
                        id="iconButton"
                        variant="contained"
                        disabled={!canUndo}
                        onClick={() =>
                            store.dispatch(UndoActionCreators.undo())
                        }>
                        <UndoIcon id="iconButtonInner" />
                    </IconButton>
                </span>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="Redo (Ctrl + Y)"
                TransitionProps={{ timeout: 0 }}
                placement="bottom">
                <span>
                    <IconButton
                        id="iconButton"
                        variant="contained"
                        disabled={!canRedo}
                        onClick={() =>
                            store.dispatch(UndoActionCreators.redo())
                        }>
                        <RedoIcon id="iconButtonInner" />
                    </IconButton>
                </span>
            </Tooltip>
        </>
    )
}
