import { useCallback, useEffect, useState } from "react"
import { view } from "../state"
import { ViewSubscription } from "../state/index.types"

export const useView = (subscriber: ViewSubscription) => {
    const [, render] = useState<object>({})
    const reRender = useCallback(() => render({}), [])

    useEffect(() => {
        view.subscribe(subscriber, reRender)

        return () => {
            view.unsubscribe(subscriber, reRender)
        }
    }, [reRender, subscriber])

    return view.getState()
}
