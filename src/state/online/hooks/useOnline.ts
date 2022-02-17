import { useCallback, useEffect, useState } from "react"
import { online } from "../state"

export const useOnline = () => {
    const [, render] = useState<object>({})
    const trigger = useCallback(() => render({}), [])

    useEffect(() => {
        online.subscribe(trigger)

        return () => {
            online.unsubscribe(trigger)
        }
    }, [])

    return online.getState()
}
