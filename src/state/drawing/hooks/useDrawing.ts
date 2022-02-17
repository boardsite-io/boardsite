import { useCallback, useEffect, useState } from "react"
import { drawing } from "../state"
import { DrawingSubscription } from "../state/index.types"

export const useDrawing = (...subscriptions: DrawingSubscription[]) => {
    const [, render] = useState<object>({})
    const trigger = useCallback(() => render({}), [])

    useEffect(() => {
        subscriptions.forEach((sub) => {
            drawing.subscribe(trigger, sub)
        })

        return () => {
            subscriptions.forEach((sub) => {
                drawing.unsubscribe(trigger, sub)
            })
        }
    }, [])

    return drawing.getState()
}
