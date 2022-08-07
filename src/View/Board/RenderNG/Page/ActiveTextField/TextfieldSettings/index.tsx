import { Button, Dialog, DialogContent } from "components"
import { DialogProps } from "components/Dialog"
import React from "react"
import { drawing } from "state/drawing"
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
    const textfield = drawing.getState().textfieldAttributes

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent>
                <FontSizes>
                    {PRESETS.map((fontSize) => (
                        <Button
                            key={fontSize}
                            onClick={() => {
                                drawing.setTextfieldAttributes({
                                    ...textfield,
                                    fontSize,
                                    lineHeight: fontSize * 1.25,
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
