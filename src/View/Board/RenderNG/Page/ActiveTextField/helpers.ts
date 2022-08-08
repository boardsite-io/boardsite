import { cloneDeep } from "lodash"
import { action } from "state/action"
import { board } from "state/board"
import { drawing } from "state/drawing"
import { getUnflippedRect } from "util/render/shapes"

export const onFinishTextEdit = (
    inputRef: React.RefObject<HTMLTextAreaElement>
) => {
    const { textfieldAttributes } = drawing.getState()
    const { activeTextfield } = board.getState()
    if (!activeTextfield) return

    const { left, top } = getUnflippedRect(activeTextfield.points)

    const input = inputRef.current
    if (input) {
        const { value, offsetWidth, offsetHeight, offsetLeft, offsetTop } =
            input

        if (value) {
            activeTextfield.textfield = cloneDeep(textfieldAttributes)
            activeTextfield.points = [
                left + offsetLeft,
                top + offsetTop,
                left + offsetLeft + offsetWidth,
                top + offsetTop + offsetHeight,
            ]
            activeTextfield.calculateHitbox() // Update Hitbox

            if (activeTextfield.isUpdate) {
                action.updateStrokes([activeTextfield])
            } else {
                action.addStrokes([activeTextfield])
            }
        } else if (value === "" && activeTextfield.isUpdate) {
            // Delete edited textfield if now empty
            action.deleteStrokes([activeTextfield])
        }
    }

    board.clearActiveTextfield()
}
