import { FormattedMessage } from "language"
import React from "react"
import { useBoard } from "state/board"
import { RedoIcon, UndoIcon } from "components"
import { handleRedo, handleUndo } from "drawing/handlers"
import { SubMenuWrap } from "../../../index.styled"
import MenuItem from "../../../MenuItem"

const EditMenu = () => {
    const { undoStack, redoStack } = useBoard("EditMenu")
    const disableUndoStack = undoStack?.length === 0
    const disableRedoStack = redoStack?.length === 0

    return (
        <SubMenuWrap>
            <MenuItem
                disabled={disableUndoStack}
                text={<FormattedMessage id="Menu.General.Edit.Undo" />}
                icon={<UndoIcon />}
                onClick={handleUndo}
            />
            <MenuItem
                disabled={disableRedoStack}
                text={<FormattedMessage id="Menu.General.Edit.Redo" />}
                icon={<RedoIcon />}
                onClick={handleRedo}
            />
        </SubMenuWrap>
    )
}

export default EditMenu
