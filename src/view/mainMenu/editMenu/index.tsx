import { FormattedMessage } from "language"
import React from "react"
import { RedoIcon, UndoIcon } from "components"
import { handleRedo, handleUndo } from "drawing/handlers"
import { useCustomSelector } from "hooks"
import { SubMenuWrap } from "../index.styled"
import MenuItem from "../menuItem"

const EditMenu = () => {
    const disableUndoStack = useCustomSelector(
        (state) => state.board.undoStack?.length === 0
    )
    const disableRedoStack = useCustomSelector(
        (state) => state.board.redoStack?.length === 0
    )

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
