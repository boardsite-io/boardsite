import { useCallback, useEffect, useState } from "react"
import { view } from "../state"

export const useViewState = () => {
    const [, render] = useState<object>({})
    const reRender = useCallback(() => render({}), [])

    useEffect(() => {
        view.subscribe("viewTransform", reRender)

        return () => {
            view.unsubscribe("viewTransform", reRender)
        }
    }, [reRender])

    return view.getViewTransform()
}
