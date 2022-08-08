import { MenuIcon } from "components"
import { TEXTFIELD_MIN_HEIGHT, TEXTFIELD_MIN_WIDTH } from "consts"
import React, { ChangeEvent, memo, useEffect, useRef } from "react"
import { useGState } from "state"
import { board } from "state/board"
import { drawing } from "state/drawing"
import { menu } from "state/menu"
import { applyTransformOnPoints, getUnflippedRect } from "util/render/shapes"
import { PageProps } from "../index.types"
import { onFinishTextEdit } from "./helpers"
import {
    Textarea,
    TextfieldBackground,
    TextfieldSettingsButton,
    AttributesProvider,
    TEXTFIELD_PADDING,
} from "./index.styled"
import { useKeylistener } from "./useKeylistener"

export const ActiveTextfield: React.FC<PageProps> = memo(
    ({ page, pageOffset }) => {
        const { textfieldAttributes } = useGState("Textfield").drawing
        const inputRef = useRef<HTMLTextAreaElement>(null)
        const { activeTextfield } = board.getState()

        const hideTextfield =
            !activeTextfield || activeTextfield.pageId !== page.pageId

        useKeylistener(inputRef)

        useEffect(() => {
            if (hideTextfield) return
            const input = inputRef.current
            if (!input) return

            input.setSelectionRange(0, input.value.length)
        }, [hideTextfield])

        if (hideTextfield) return null

        // Transform the points to remove scale / offset
        applyTransformOnPoints(activeTextfield)

        const { left, top, width, height } = getUnflippedRect(
            activeTextfield.points
        )

        return (
            <>
                <TextfieldBackground
                    onClick={() => onFinishTextEdit(inputRef)}
                    style={{
                        width: page.meta.size.width,
                        height: page.meta.size.height,
                        left: pageOffset.left,
                        top: pageOffset.top,
                    }}
                />
                <AttributesProvider
                    {...textfieldAttributes}
                    style={{
                        left: left + pageOffset.left - TEXTFIELD_PADDING,
                        top: top + pageOffset.top - TEXTFIELD_PADDING,
                    }}
                >
                    <TextfieldSettingsButton
                        icon={<MenuIcon />}
                        onClick={() => {
                            menu.openTextfieldSettings()
                        }}
                    />
                    <Textarea
                        value={textfieldAttributes.text}
                        autoFocus
                        ref={inputRef}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                            drawing.setTextfieldAttributes({
                                ...textfieldAttributes,
                                text: e.target.value,
                            })
                        }}
                        width={Math.max(width, TEXTFIELD_MIN_WIDTH)}
                        height={Math.max(height, TEXTFIELD_MIN_HEIGHT)}
                    />
                </AttributesProvider>
            </>
        )
    }
)
