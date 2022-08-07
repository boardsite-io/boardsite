import { MenuIcon } from "components"
import { TEXTFIELD_MIN_HEIGHT, TEXTFIELD_MIN_WIDTH } from "consts"
import { cloneDeep } from "lodash"
import React, { ChangeEvent, memo, useEffect, useRef } from "react"
import { useGState } from "state"
import { action } from "state/action"
import { board } from "state/board"
import { drawing } from "state/drawing"
import { menu } from "state/menu"
import { applyTransformOnPoints, getUnflippedRect } from "util/render/shapes"
import { PageProps } from "../index.types"
import {
    Textarea,
    TextfieldBackground,
    TextfieldSettingsButton,
    AttributesProvider,
    TEXTFIELD_PADDING,
} from "./index.styled"

export const ActiveTextfield: React.FC<PageProps> = memo(
    ({ page, pageOffset }) => {
        const { textfieldAttributes } = useGState("Textfield").drawing
        const inputRef = useRef<HTMLTextAreaElement>(null)
        const { activeTextfield } = board.getState()

        const hideTextfield =
            !activeTextfield || activeTextfield.pageId !== page.pageId

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

        const onFinishTextEdit = () => {
            if (!activeTextfield) return

            const input = inputRef.current
            if (input) {
                const {
                    value,
                    offsetWidth,
                    offsetHeight,
                    offsetLeft,
                    offsetTop,
                } = input

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
                }
            }

            board.clearActiveTextfield()
        }

        return (
            <>
                <TextfieldBackground
                    onClick={onFinishTextEdit}
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
