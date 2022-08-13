import React, { useEffect } from "react"
import { onFinishTextEdit } from "./helpers"

export const useKeylistener = (
    inputRef: React.RefObject<HTMLTextAreaElement>
) => {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onFinishTextEdit(inputRef)
            }
        }
        window.addEventListener("keydown", onKeyDown)

        return () => {
            window.removeEventListener("keydown", onKeyDown)
        }
    }, [inputRef])
}
