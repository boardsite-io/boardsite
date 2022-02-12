import { useCallback, useEffect, useState } from "react"
import { viewState } from "./ViewState"

export const useViewState = () => {
    const [, render] = useState<object>({})
    const reRender = useCallback(() => render({}), [])

    useEffect(() => {
        viewState.subscribeView(reRender)

        return () => {
            viewState.unsubscribeTransform(reRender)
        }
    }, [])

    return viewState.getTransformState()
}
