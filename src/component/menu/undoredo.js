import React from "react"
import { ActionCreators as UndoActionCreators } from "redux-undo"
import { useDispatch, useSelector } from "react-redux"
import UndoIcon from "@material-ui/icons/Undo"
import RedoIcon from "@material-ui/icons/Redo"
import Tooltip from "@material-ui/core/Tooltip"
import { IconButton } from "@material-ui/core"

export default function UndoRedo() {
    const dispatch = useDispatch()
    const canUndo = useSelector((state) => state.boardControl.past.length > 0)
    const canRedo = useSelector((state) => state.boardControl.future.length > 0)

    return (
        <>
            <Tooltip
                id="tooltip"
                title="undo"
                TransitionProps={{ timeout: 0 }}
                placement="bottom">
                <span>
                    <IconButton
                        id="iconButton"
                        variant="contained"
                        disabled={!canUndo}
                        onClick={() => dispatch(UndoActionCreators.undo())}>
                        <UndoIcon id="iconButtonInner" />
                    </IconButton>
                </span>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="redo"
                TransitionProps={{ timeout: 0 }}
                placement="bottom">
                <span>
                    <IconButton
                        id="iconButton"
                        variant="contained"
                        disabled={!canRedo}
                        onClick={() => dispatch(UndoActionCreators.redo())}>
                        <RedoIcon id="iconButtonInner" />
                    </IconButton>
                </span>
            </Tooltip>
        </>
    )
}
