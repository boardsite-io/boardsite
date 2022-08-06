import { Button, Dialog, DialogContent } from "components"
import { DialogProps } from "components/Dialog"
import React from "react"
import { board } from "state/board"
import { FontSizes } from "./index.styled"

interface TextfieldSettingsProps {
    open: DialogProps["open"]
    onClose: DialogProps["onClose"]
}

const PRESETS = [16, 20, 24, 32, 40, 50]

const TextfieldSettings: React.FC<TextfieldSettingsProps> = ({
    open,
    onClose,
}) => {
    const textarea = board.getState().activeTextfield?.textfield

    if (!textarea) {
        return null
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent>
                <FontSizes>
                    {PRESETS.map((fontSize) => (
                        <Button
                            key={fontSize}
                            onClick={() => {
                                board.setTextareaAttributes({
                                    ...textarea,
                                    fontSize,
                                    lineHeight: fontSize,
                                })
                            }}
                        >
                            {fontSize}px
                        </Button>
                    ))}
                </FontSizes>
            </DialogContent>
        </Dialog>
    )
}

export default TextfieldSettings
