import { useCallback, useEffect, useState } from "react"
import { view } from "../state"

export const useViewState = () => {
    const [, render] = useState<object>({})
    const reRender = useCallback(() => render({}), [])

    useEffect(() => {
        view.subscribe(reRender, "viewTransform")

        return () => {
            view.unsubscribe(reRender, "viewTransform")
        }
    }, [])

    return view.getViewTransform()
}
