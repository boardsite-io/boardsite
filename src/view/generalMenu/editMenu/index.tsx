import { FormattedMessage } from "language"
import React from "react"
import { RedoIcon, UndoIcon } from "components"
import { handleRedo, handleUndo } from "drawing/handlers"
import { useCustomSelector } from "hooks"
import { SubMenu } from "../index.styled"
import MenuItem from "../menuItem"

const EditMenu = () => {
    const disableUndoStack = useCustomSelector(
        (state) => state.board.undoStack?.length === 0
    )
    const disableRedoStack = useCustomSelector(
        (state) => state.board.redoStack?.length === 0
    )

    return (
        <SubMenu>
            <MenuItem
                disabled={disableUndoStack}
                text={<FormattedMessage id="GeneralMenu.Edit.Undo" />}
                icon={<UndoIcon />}
                onClick={handleUndo}
            />
            <MenuItem
                disabled={disableRedoStack}
                text={<FormattedMessage id="GeneralMenu.Edit.Redo" />}
                icon={<RedoIcon />}
                onClick={handleRedo}
            />
        </SubMenu>
    )
}

export default EditMenu
