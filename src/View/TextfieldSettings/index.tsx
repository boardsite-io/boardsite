import { Button, Dialog } from "components"
import React from "react"
import { useGState } from "state"
import { menu } from "state/menu"
import { FormattedMessage } from "language"
import { drawing } from "state/drawing"
import { FONT_SIZE_PRESETS } from "consts"
import {
    ContentWrapper,
    CustomColorPicker,
    FontSizes,
    TextPreview,
    TextPreviewWrapper,
} from "./index.styled"

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
                    {FONT_SIZE_PRESETS.map((fontSize) => (
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
