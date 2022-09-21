import { debounce } from "lodash"
import { useEffect } from "react"
import { view } from "state/view"

const onResize = debounce(() => {
    view.updateViewDimensions()
}, 300)

/**
 * Handle a window resize event
 */
export const useWindowResize = () => {
    useEffect(() => {
        window.addEventListener("resize", onResize)
        return () => window.removeEventListener("resize", onResize)
    }, [])
}
