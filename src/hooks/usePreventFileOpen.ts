import { useEffect } from "react"

const ondragover = (e: DragEvent) => e.preventDefault()
const ondrop = (e: DragEvent) => e.preventDefault()

export const usePreventFileOpen = (): void => {
    useEffect(() => {
        window.addEventListener("dragover", ondragover, false)
        window.addEventListener("drop", ondrop, false)

        return () => {
            window.removeEventListener("dragover", ondragover, false)
            window.removeEventListener("drop", ondrop, false)
        }
    }, [])
}
