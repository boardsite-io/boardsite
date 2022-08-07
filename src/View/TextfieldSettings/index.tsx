import { Button, Dialog } from "components"
import React from "react"
import { useGState } from "state"
import { menu } from "state/menu"
import { FormattedMessage } from "language"
import { drawing } from "state/drawing"
import {
    ContentWrapper,
    CustomColorPicker,
    FontSizes,
    TextPreview,
    TextPreviewWrapper,
} from "./index.styled"

const PRESETS = [12, 16, 20, 24, 32, 40, 50, 60]

const TextfieldSettings: React.FC = () => {
    const { menu: menuState, drawing: drawingState } =
        useGState("TextfieldSettings")

    return (
        <Dialog
            open={menuState.textfieldSettingsOpen}
            onClose={() => menu.closeTextfieldSettings()}
        >
            <TextPreviewWrapper>
                <TextPreview
                    {...drawingState.textfieldAttributes}
                    style={{ color: drawingState.textfieldAttributes.color }}
                >
                    <FormattedMessage id="TextfieldSettings.SampleText" />
                </TextPreview>
            </TextPreviewWrapper>
            <ContentWrapper>
                <CustomColorPicker
                    color={drawingState.textfieldAttributes.color}
                    onChange={(newColor) => {
                        drawing.setTextfieldAttributes({
                            ...drawingState.textfieldAttributes,
                            color: newColor,
                        })
                    }}
                />
                <FontSizes>
                    {PRESETS.map((fontSize) => (
                        <Button
                            key={fontSize}
                            onClick={() => {
                                drawing.setTextfieldAttributes({
                                    ...drawingState.textfieldAttributes,
                                    fontSize,
                                    lineHeight: fontSize * 1.25,
                                })
                            }}
                            disabled={
                                drawingState.textfieldAttributes.fontSize ===
                                fontSize
                            }
                        >
                            {fontSize}px
                        </Button>
                    ))}
                </FontSizes>
            </ContentWrapper>
        </Dialog>
    )
}

export default TextfieldSettings
