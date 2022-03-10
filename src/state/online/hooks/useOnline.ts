import { useCallback, useEffect, useState } from "react"
import { online } from "../state"
import { OnlineSubscription } from "../state/index.types"

export const useOnline = (subscriber: OnlineSubscription) => {
    const [, render] = useState<object>({})
    const trigger = useCallback(() => render({}), [])

    useEffect(() => {
        online.subscribe(subscriber, trigger)

        return () => {
            online.unsubscribe(subscriber, trigger)
        }
    }, [subscriber, trigger])

    return online.getState()
}
