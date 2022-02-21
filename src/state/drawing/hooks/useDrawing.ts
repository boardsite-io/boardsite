import { useCallback, useEffect, useState } from "react"
import { drawing } from "../state"
import { DrawingSubscriber } from "../state/index.types"

export const useDrawing = (subscriber: DrawingSubscriber) => {
    const [, render] = useState<object>({})
    const trigger = useCallback(() => render({}), [])

    useEffect(() => {
        drawing.subscribe(subscriber, trigger)

        return () => {
            drawing.unsubscribe(subscriber, trigger)
        }
    }, [])

    return drawing.getState()
}
