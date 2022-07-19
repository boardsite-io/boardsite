import { TEXTFIELD_MIN_HEIGHT, TEXTFIELD_MIN_WIDTH } from "consts"
import { handleAddStrokes } from "drawing/handlers"
import React, {
    ChangeEvent,
    KeyboardEvent,
    memo,
    MouseEvent,
    useCallback,
    useEffect,
    useRef,
} from "react"
import { useGState } from "state"
import { board } from "state/board"
import { applyTransformOnPoints, getUnflippedRect } from "util/render/shapes"
import { cloneDeep } from "lodash"
import { PageProps } from "../index.types"
import { Textfield, TextfieldBackground } from "./index.styled"

export const ActiveTextfield: React.FC<PageProps> = memo(
    ({ page, pageOffset }) => {
        useGState("Textfield")

        const inputRef = useRef<HTMLTextAreaElement>(null)
        const { activeTextfield } = board.getState()

        const onFinishTextEdit = useCallback(() => {
            if (!activeTextfield?.textfield) return

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
                    activeTextfield.textfield.text = value
                    activeTextfield.points = [
                        offsetLeft,
                        offsetTop,
                        offsetLeft + offsetWidth,
                        offsetTop + offsetHeight,
                    ]
                    activeTextfield.calculateHitbox() // Update Hitbox

                    handleAddStrokes(
                        [activeTextfield],
                        !!activeTextfield.isUpdate
                    )
                }
            }

            board.clearActiveTextfield()
        }, [activeTextfield])

        const currentTextfield = activeTextfield?.textfield
        const hideTextfield =
            !currentTextfield || activeTextfield.pageId !== page.pageId

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
            <TextfieldBackground
                {...currentTextfield}
                onClick={onFinishTextEdit}
                style={{
                    width: page.meta.size.width,
                    height: page.meta.size.height,
                    left: pageOffset.left,
                    top: pageOffset.top,
                }}
            >
                <Textfield
                    defaultValue={currentTextfield.text}
                    color={currentTextfield.color}
                    autoFocus
                    ref={inputRef}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                        currentTextfield.text = e.target.value
                    }}
                    onClick={(e: MouseEvent<HTMLTextAreaElement>) => {
                        e.stopPropagation()
                        e.preventDefault()
                    }}
                    onKeyUp={(e: KeyboardEvent<HTMLTextAreaElement>) => {
                        e.stopPropagation()
                        e.preventDefault()
                    }}
                    style={{
                        width: Math.max(width, TEXTFIELD_MIN_WIDTH),
                        height: Math.max(height, TEXTFIELD_MIN_HEIGHT),
                        left,
                        top,
                    }}
                />
            </TextfieldBackground>
        )
    }
)
