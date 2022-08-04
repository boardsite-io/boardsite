import React from "react"
import { FormattedMessage } from "language"
import { useGState } from "state"
import { RedoIcon, UndoIcon } from "components"
import { SubMenuWrap } from "View/MainMenu/index.styled"
import MenuItem from "View/MainMenu/MenuItem"
import { action } from "state/action"

const EditMenu = () => {
    const { undoStack, redoStack } = useGState("EditMenu").action
    const disableUndoStack = undoStack.length === 0
    const disableRedoStack = redoStack.length === 0

    return (
        <SubMenuWrap>
            <MenuItem
                disabled={disableUndoStack}
                text={<FormattedMessage id="Menu.General.Edit.Undo" />}
                icon={<UndoIcon />}
                onClick={action.undo}
            />
            <MenuItem
                disabled={disableRedoStack}
                text={<FormattedMessage id="Menu.General.Edit.Redo" />}
                icon={<RedoIcon />}
                onClick={action.redo}
            />
        </SubMenuWrap>
    )
}

export default EditMenu
